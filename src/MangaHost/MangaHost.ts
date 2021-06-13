import {
    Chapter,
    ChapterDetails,
    HomeSection,
    Manga,
    PagedResults,
    RequestHeaders,
    SearchRequest, 
    Source,
    SourceInfo, 
    TagType
} from 'paperback-extensions-common';

import {
    generateUserAgent,
    parseChapters,
    parseChapterDetails,
    parseHomeSection,
    parseMangaDetails,
    parseSearch,
    parseViewMore
} from './MangaHostParser'

import { HomeSectionType } from './utils'


const MANGAHOST_DOMAIN = 'https://mangahosted.com'
const method = 'GET'
const headers: RequestHeaders = {
    "user-agent": generateUserAgent(),
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
            text: 'Portuguese',
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
        const featured = createHomeSection({id: HomeSectionType.FEATURED, title: 'DESTAQUES', view_more: true})
        const latest = createHomeSection({id: HomeSectionType.LATEST, title: 'ÚLTIMAS ATUALIZAÇÕES', view_more: true })
        const recommended = createHomeSection({id: HomeSectionType.RECOMMENDED, title: 'RECOMENDAMOS', view_more: true})
        const week = createHomeSection({id: HomeSectionType.WEEK, title: 'MANGÁ DA SEMANA' })

        sectionCallback(featured)
        sectionCallback(latest)
        sectionCallback(recommended)
        sectionCallback(week)
        
        const request = createRequestObject({ url: MANGAHOST_DOMAIN, method, headers})
        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)
        
        parseHomeSection($, featured, sectionCallback)
        parseHomeSection($, latest, sectionCallback)
        parseHomeSection($, recommended, sectionCallback)
        parseHomeSection($, week, sectionCallback)
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
            metadata: undefined
        })
    }

    async getViewMoreItems(homepageSectionId: string, metadata: any): Promise<PagedResults | null> {
        const request = createRequestObject({
            url: MANGAHOST_DOMAIN,
            method,
            headers
        })

        const response = await this.requestManager.schedule(request, 1)
        const $ = this.cheerio.load(response.data)

        const mangas = parseViewMore($, homepageSectionId)

        return  createPagedResults({
            results: mangas,
            metadata: undefined
        })
    }
}