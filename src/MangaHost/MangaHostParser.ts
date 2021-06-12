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

import {
    getAlternativeTitles,
    getChapterDate,
    getMetaInfo,
    getTagSection,
    getWeekMangaImage,
    HomeSectionType,
} from './utils'

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

        chapters.push(createChapter({
            id,
            mangaId,
            name,
            chapNum,
            langCode: LanguageCode.PORTUGUESE,
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

export const parseHomeSections = ($: CheerioStatic, sections: HomeSection[], sectionCallBack: (section: HomeSection) => void ): void => {
    for (const section of sections) sectionCallBack(section)

    for (const section of sections) {

        switch(section.id) {
            case HomeSectionType.FEATURED: {
                section.items = parseFeaturedManga($, $('#destaques .manga-block').toArray())
                break;
            }
            case HomeSectionType.LATEST: {
                section.items = parseLatestManga($, $('#dados .column-img').toArray())
                break;
            }
            case HomeSectionType.RECOMMENDED: {
                section.items = parseRecommendedManga($, $('#recomendamos .column-img').toArray())
                break;
            }
            case HomeSectionType.WEEK: {
                section.items = parseWeekManga($, $('#dica .widget-content').toArray())
                break;
            }
            default: {
                break;
            }
        }    
    }

    for (const section of sections) sectionCallBack(section)
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
            subtitleText: createIconText({ text: subtitle})
        }))
    }

    return mangas
}


const parseFeaturedManga = ($: CheerioStatic, elements: CheerioElement[]): MangaTile[] => {
    const mangas: MangaTile[] = []

    for (const element of elements) {
        const anchor = $('a', element).first()
        const id: string = anchor.attr('href')?.split('/').pop() ?? ''
        const image: string = $('img', anchor).attr('src') ?? ''
        const title: string = anchor.attr('title') ?? ''

        mangas.push(createMangaTile({
            id,
            image,
            title: createIconText({text: title})
        }))
    }

    return mangas
}

const parseLatestManga = ($: CheerioStatic, elements: CheerioElement[]): MangaTile[] => {
    const mangas: MangaTile[] = []

    for (const element of elements) {
        const id: string = $('a', element).first().attr('href')?.split('/').pop() ?? ''
        const image: string = $('a img', element).first().attr('src') ?? ''
        const title: string = $('a', element).first().attr('title')?.trim() ?? ''

        mangas.push(createMangaTile({
            id,
            image,
            title: createIconText({text: title})
        }))
    }

    return mangas
}

const parseRecommendedManga = ($: CheerioStatic, elements: CheerioElement[]): MangaTile[] => {
    const mangas: MangaTile[] = []

    for (const element of elements) {
        const id: string = $('a', element).first().attr('href')?.split('/').pop() ?? ''
        const image: string = $('a img', element).first().attr('src') ?? ''
        const title: string = $('a', element).first().attr('title')?.trim() ?? ''

        mangas.push(createMangaTile({
            id,
            image,
            title: createIconText({text: title})
        }))
    }

    return mangas
}

const parseWeekManga = ($: CheerioStatic, elements: CheerioElement[]): MangaTile[] => {
    const mangas: MangaTile[] = []

    for (const element of elements) {
        const id: string = $('a', element).first().attr('href')?.split('/').pop() ?? ''
        const image: string = getWeekMangaImage($('a img', element).first().attr('src') ?? '')
        const title: string = $('a', element).first().attr('title')?.trim() ?? ''

        mangas.push(createMangaTile({
            id,
            image,
            title: createIconText({text: title})
        }))
    }

    return mangas
}


// should parse demografic latest mangas - SHOUNEN, SHOUJO, SEINEN
const parseLatestCategories = ($: CheerioStatic, sections: HomeSection[], sectionCallBack: (section: HomeSection) => void ): void => {

}