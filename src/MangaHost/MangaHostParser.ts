import {
    Chapter,
    ChapterDetails,
    HomeSection,
    LanguageCode,
    Manga,
    MangaStatus,
    MangaTile,
    Tag,
    TagSection,
} from 'paperback-extensions-common'

import { HomeSectionType } from './utils'

export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {

    const metaPanel = $('article .text div.w-row .w-col').first().children('ul')

    const id: string = mangaId
    const title: string = $('article .title').text()
    const titles: string[] = [title].concat(getAlternativeTitles($('article .subtitle').text()))
    const image: string = $('.widget img').first().attr('src') ?? ''
    const rating: number = Number($('.classificacao-box-1 .stars h3').text())
    const status: MangaStatus = $('article .subtitle strong').text().toUpperCase() == 'ATIVO' ? MangaStatus.ONGOING : MangaStatus.COMPLETED
    const langFlag = 'pt-br'
    const langName = 'Brazilian Portuguese'
    const artist: string = getMetaInfo(metaPanel.children('li').eq(3).children('div').text())
    const author: string = getMetaInfo(metaPanel.children('li').eq(2).children('div').text())
    const desc: string = $('article .text .paragraph p').first().text().trim()
    const tags: TagSection[] = getTagSection($, $('article .tags a.tag').toArray())
    const relatedIds: string[] = $('#recomendamos .content-lancamento').toArray().map(elem => $('a', elem).attr('href')?.split('/').pop() ?? '')
    const lastUpdate: string = getChapterDate($("article section .chapters .cap div.pop-content small").first().text())
    const views: number = Number($('.classificacao-box-1 div:nth-child(2)').text().split(' ')[0])

    return createManga({
        id,
        titles,
        image,
        rating,
        status,
        langFlag,
        langName,
        artist,
        author,
        desc,
        tags,
        views,
        relatedIds,
        lastUpdate
    })
}

export const parseChapters = ($: CheerioStatic, mangaId: string): Chapter[] => {

    const elements = $('article section .chapters .cap').toArray()
    const chapters: Chapter[] = []

    for (let chapter of elements) {
        const id: string = $('.tags a', chapter).attr('href')?.split('/').pop() ?? ''
        const name: string = $('a.btn-caps', chapter).attr('title')?.split('-')[0].trim().replace('#', '') ?? ''
        const chapNum: number = Number($('a.btn-caps', chapter).text())

        const time: Date = new Date(getChapterDate($('div.pop-content small', chapter).text()))

        // if (Number.isNaN(chapNum)) continue;
        // TODO: Need a solution to NaN cases
        // Something like transforming extra-02
        // into last-chapter-number.1 .2 .3 and so on

        chapters.push(createChapter({
            id,
            mangaId,
            name,
            chapNum,
            langCode: LanguageCode.BRAZILIAN,
            time
        }))
    }
    return chapters
}

export const parseChapterDetails = ($: CheerioStatic, mangaId: string, chapterId: string): ChapterDetails => {
    const pages: string[] = []

    const allPages = $('div#slider a').toArray()

    for (let page of allPages) {
        pages.push($('img', page).attr('src') ?? '')
    }

    return createChapterDetails({
        id: chapterId,
        mangaId: mangaId,
        pages,
        longStrip: false
    })
}

export const parseHomeSection = ($: CheerioStatic, section: HomeSection, sectionCallback: (section: HomeSection) => void): void => {

    switch (section.id) {
        case HomeSectionType.FEATURED:
            section.items = parseMangaTile($, $('#destaques .manga-block').toArray().slice(0, 7))
            break;

        case HomeSectionType.LATEST: 
            section.items = parseMangaTile($, $('#dados .column-img').toArray().slice(0, 7))
            break;

        case HomeSectionType.RECOMMENDED: 
            section.items = parseMangaTile($, $('#recomendamos .column-img').toArray().slice(0, 5))
            break;

        case HomeSectionType.WEEK: 
            section.items = parseWeekMangaTile($, $('#dica .widget-content').toArray())
            break;

        case HomeSectionType.SHOUNEN:
            section.items = parseMangaTile($, $('#recomendamos .column-img').toArray())
            break;

        case HomeSectionType.SHOUJO: 
            section.items = parseMangaTile($, $('#recomendamos .column-img').toArray())
            break;

        case HomeSectionType.SEINEN:
            section.items = parseMangaTile($, $('#recomendamos .column-img').toArray())
            break;
    }

    sectionCallback(section)
}

export const parseSearch = ($: CheerioStatic): MangaTile[] => {
    const results = $('main table.table-search tbody tr').toArray()
    const mangas: MangaTile[] = []

    for (const result of results) {
        const td = $('td', result).first()
        const id: string = $('a', td).attr('href')?.split('/').pop() ?? ''
        const image: string = $('img', td).attr('src') ?? ''
        const title: string = $('a', td).attr('title') ?? ''
        const subtitle: string = $('span.muted', result).text()

        mangas.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title }),
            subtitleText: createIconText({ text: subtitle })
        }))
    }

    return mangas
}

export const parseViewMore = ($: CheerioStatic, sectionId: string): MangaTile[] => {
    switch (sectionId) {
        case HomeSectionType.FEATURED:
            return parseMangaTile($, $('#destaques .manga-block').toArray())

        case HomeSectionType.LATEST: 
            return parseMangaTile($, $('#dados .column-img').toArray())

        case HomeSectionType.RECOMMENDED: 
            return parseMangaTile($, $('#recomendamos .column-img').toArray())

        case HomeSectionType.WEEK: 
            return parseWeekMangaTile($, $('#dica .widget-content').toArray())

        case HomeSectionType.SHOUNEN:
            return parseMangaTile($, $('#recomendamos .column-img').toArray())

        case HomeSectionType.SHOUJO: 
            return parseMangaTile($, $('#recomendamos .column-img').toArray())

        case HomeSectionType.SEINEN:
            return parseMangaTile($, $('#recomendamos .column-img').toArray())
        default:
            return []
    }
}

const parseMangaTile = ($: CheerioStatic, elements: CheerioElement[]): MangaTile[] => {
    const mangas: MangaTile[] = []

    for (const element of elements) {
        const id: string = $('a', element).first().attr('href')?.split('/').pop() ?? ''
        const image: string = $('a img', element).first().attr('src') ?? ''
        const title: string = $('a', element).first().attr('title') ?? ''

        mangas.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title })
        }))
    }

    return mangas
}

const parseWeekMangaTile = ($: CheerioStatic, elements: CheerioElement[]): MangaTile[] => {
    const mangas: MangaTile[] = []

    for (const element of elements) {
        const id: string = $('a', element).first().attr('href')?.split('/').pop() ?? ''
        const image: string = getWeekMangaImage($('a img', element).first().attr('src') ?? '')
        const title: string = $('a', element).first().attr('title')?.trim() ?? ''

        mangas.push(createMangaTile({
            id,
            image,
            title: createIconText({ text: title })
        }))
    }

    return mangas
}


/* Utilities */

const getMetaInfo = (scrapedContent: string): string => {
    const match: string = ': '
    const index: number = scrapedContent.lastIndexOf(match)
    const result: string = scrapedContent.slice(index + match.length)
    return result
}

const getAlternativeTitles = (scrapedContent: string): string[] => {
    const ativo: number = scrapedContent.lastIndexOf('Ativo')
    const completo: number = scrapedContent.lastIndexOf('Completo')
    const index: number = ativo !== -1 ? ativo : completo
    const result = scrapedContent.slice(0, index)

    if (result?.includes(',')) {
        return result.split(',').map(title => title.trim())
    }

    return [result];
}

const getChapterDate = (scrapedContent: string): string => {
    const match: string = 'Adicionado em '
    const index: number = scrapedContent.lastIndexOf(match)
    const result: string = scrapedContent.slice(index + match.length)
    return result
}

const getTagSection = ($: CheerioStatic, elements: CheerioElement[]): TagSection[] => {
    const tagList: Tag[] = elements
        .map(elem => $(elem).text())
        .map(tag => createTag({
            id: tag,
            label: tag
        }))

    return [createTagSection({
        id: 'mangahost-tags',
        label: 'Gêneros',
        tags: tagList
    })]
}

const getWeekMangaImage = (src: string): string => {
    // src: /wp-content/themes/mangahost/img/destaque/iris-zero.jpg
    const imageName: string = src.split('/').pop()?.split('.').shift() ?? '' // get "iris-zero"
    return `https://img-host.filestatic1.xyz/mangas_files/iris-zero/image_${imageName}_xmedium.jpg`
}

/**
 * Got this function from user PythonCoderAS
 * https://github.com/Paperback-iOS/extensions-foreign/issues/13#issuecomment-812678764
 */
export const generateUserAgent = () => {
    // This makes a random user agent (copied from my user agent).
    // Range: Chrome/89.0.4500.100 through Chrome/89.0.5000.150
    return `Mozilla/5.0 (Macintosh; Intel Mac OS X 11_2_3) AppleWebKit/537.36 (KHTML, like Gecko) ` +
        `Chrome/89.0.${Math.round(Math.random() * 500 + 4500)}.${Math.round(Math.random() * 50 + 100)} ` +
        `Safari/537.36`
}