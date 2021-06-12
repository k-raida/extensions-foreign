import {
    Chapter,
    ChapterDetails,
    HomeSection,
    Manga,
    PagedResults,
    SearchRequest, 
    Source,
    SourceInfo, 
    TagType 
} from 'paperback-extensions-common';

import {
    parseChapters,
    parseChapterDetails,
    parseHomeSections,
    parseMangaDetails,
    parseSearch
} from './MangaHostParser'

import { HomeSectionType } from './utils'

const MANGAHOST_DOMAIN = 'https://mangahosted.com'
const method = 'GET'
const headers = {
    referer: MANGAHOST_DOMAIN
}

export const MangaHostInfo: SourceInfo = {
    version: '0.1.0',
    name: 'MangaHost',
    icon: 'icon.png',
    author: 'raidā',
    authorWebsite: 'https://github.com/k-raida',
    description: 'Extension that pulls manga from brazilian website MangaHost',
    hentaiSource: false,
    websiteBaseURL: MANGAHOST_DOMAIN,
    sourceTags: [
        {
            text: "Beta",
            type: TagType.YELLOW
        },
        {
            text: 'Portuguese',
            type: TagType.GREY
        },
        {
            text: 'Doujin',
            type: TagType.GREY
        },
        {
            text: 'Manga',
            type: TagType.GREY
        },
        {
            text: 'Manhwa',
            type: TagType.GREY
        },
        {
            text: 'Webtoon',
            type: TagType.GREY
        },
        {
            text: 'Manhua',
            type: TagType.GREY
        },
        {
            text: 'Novel',
            type: TagType.GREY
        }
    ]
}

export class MangaHost extends Source {
    getMangaShareUrl(mangaId: string): string | null { return `${MANGAHOST_DOMAIN}/manga/${mangaId}`}

    async getMangaDetails(mangaId: string): Promise<Manga> {
        const request = createRequestObject({
            url: `${MANGAHOST_DOMAIN}/manga/`,
            method,
            headers,
            param: mangaId
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        return parseMangaDetails($, mangaId)
    }

    async getChapters(mangaId: string): Promise<Chapter[]> {
        const request = createRequestObject({
            url: `${MANGAHOST_DOMAIN}/manga/`,
            method,
            headers,
            param: mangaId
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        return parseChapters($, mangaId)
    }

    async getChapterDetails(mangaId: string, chapterId: string): Promise<ChapterDetails> {
        const request = createRequestObject({
            url: `${MANGAHOST_DOMAIN}/manga/`,
            method,
            headers,
            param: `${mangaId}/${chapterId}`
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        return parseChapterDetails($, mangaId, chapterId)
    }

    async getHomePageSections(sectionCallback: (section: HomeSection) => void): Promise<void> {
        const mainHomeSections: HomeSection[] = [
            createHomeSection({id: HomeSectionType.FEATURED, title: 'DESTAQUES' }),
            createHomeSection({id: HomeSectionType.LATEST, title: 'ÚLTIMAS ATUALIZAÇÕES' }),
            createHomeSection({id: HomeSectionType.RECOMMENDED, title: 'RECOMENDAMOS' }),
            createHomeSection({id: HomeSectionType.WEEK, title: 'MANGÁ DA SEMANA' })
        ]
   
        const request = createRequestObject({
            url: MANGAHOST_DOMAIN,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 2)
        const $ = this.cheerio.load(response.data)

        parseHomeSections($, mainHomeSections, sectionCallback)

    }

    async searchRequest(query: SearchRequest, metadata: any): Promise<PagedResults> {
        const request = createRequestObject({
            url: `${MANGAHOST_DOMAIN}/find/`,
            method,
            headers,
            param: query.title
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        
        const mangas = parseSearch($)

        return createPagedResults({
            results: mangas,
            metadata
        })
    }

}