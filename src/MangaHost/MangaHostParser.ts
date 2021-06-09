import {
    Chapter,
    ChapterDetails,
    LanguageCode,
    Manga,
    MangaStatus,
    Tag,
    TagSection
} from 'paperback-extensions-common'


export const parseMangaDetails = ($: CheerioStatic, mangaId: string): Manga => {
    const imagePanel = $('div.box-content.box-perfil div.w-row div.w-col-3')
    const infoPanel = $('div.box-content.box-perfil div.w-row div.w-col-7 article')
    const metaPanel = $('article .text div.w-row .w-col', infoPanel).first().children('ul')
    const ratingPanel = $('div.box-content.box-perfil div.w-row div.w-col-2 .classificacao-box-1')


    const id: string = mangaId
    const title: string = $('.title', infoPanel).text()
    const nativeTitle: string = $('.subtitle', infoPanel).text()
    const titles: string[] = [title, nativeTitle]
    const image: string = $('.widget img', imagePanel).attr('src') ?? ''
    const rating: number = Number($('.stars h3', ratingPanel).text())
    const status: MangaStatus = $('.subtitle strong', infoPanel).text().toUpperCase() == 'ATIVO' ? MangaStatus.ONGOING : MangaStatus.COMPLETED
    const langFlag = 'pt-br'
    const langName = 'Portuguese'
    const artist: string = metaPanel.children('li').eq(4).children('div').text()
    const author: string = metaPanel.children('li').eq(3).children('div').text()
    const avgRating: number = rating
    const desc: string = $('.text .paragraph p', infoPanel).first().text()
    const tags: TagSection[] = []
    const views: number = Number($('div:nth-child(2)', ratingPanel).text().split(' ')[0])
    const relatedIds: string[] = $('#recomendamos .content-lancamento', imagePanel).toArray()
        .map(elem => $('a', elem).attr('href')?.split('/').pop() ?? '')

    const lastChapterMeta: string = $("section .chapters .cap", infoPanel).first().children('.pop-content small').text()
    const lastUpdate: string = lastChapterMeta.slice(lastChapterMeta.indexOf('Adicionado em '))


    // build tags
    const tagList: Tag[] = $('.tags a', infoPanel).toArray()
        .map(elem => $(elem).text())
        .map(tag => createTag({
            id: tag,
            label: tag
        }))

    tags.push(createTagSection({
        id: 'mangahost-tags',
        label: 'Gêneros',
        tags: tagList
    }))

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
        avgRating,
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
        const name: string = $('a.btn-caps', chapter).attr('title')?.split('-')[0].trim() ?? ''
        const chapNum: number = Number($('a.btn-caps', chapter).text())
        
        if (Number.isNaN(chapNum)) continue;

        chapters.push(createChapter({
            id,
            mangaId,
            name,
            langCode: LanguageCode.PORTUGUESE,
            chapNum
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
