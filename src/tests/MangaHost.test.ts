import cheerio from 'cheerio'
import { APIWrapper, Source } from 'paperback-extensions-common'
import { MangaHost } from '../MangaHost/MangaHost'
import { fakeMangas, HomeSectionType } from '../MangaHost/utils'

describe('MangaHost Tests', function () {

    var wrapper: APIWrapper = new APIWrapper()
    var source: Source = new MangaHost(cheerio)
    var chai = require('chai'), expect = chai.expect, should = chai.should()
    var chaiAsPromised = require('chai-as-promised')
    chai.use(chaiAsPromised)

    /**
     * The Manga ID comes from a list of fake mangas (fakeMangas: FakeManga[]) which actually has
     * some data from the real source, the results are then compared with this faker.
     * The problem is that there's a risk to this info being outdated in the time being.
     */

    const randomNumber: number = Math.floor(Math.random() * fakeMangas.length)
    const randomManga = fakeMangas[randomNumber]
    const mangaId = randomManga.id

    it('Testing Retrieve Manga Details', async () => {
        const details = await wrapper.getMangaDetails(source, mangaId)
        expect(details, "No results found with test-defined ID [" + mangaId + "]").to.exist

        const data = details
        const tags: string[] = data.tags?.length == 1 ? data.tags[0].tags.map(tag => tag.label) : []

        expect(data.id, "Missing ID").to.be.not.empty
        expect(data.id, "ID doesn't match").to.equal(randomManga.id)

        expect(data.image, "Missing Image").to.be.not.empty
        expect(data.image, "Image doesn't match").to.equal(randomManga.image)
    
        expect(data.status, "Missing Status").to.exist
        expect(data.status, "Status doesn't match").to.equal(randomManga.status)

        expect(data.author, "Missing Author").to.be.not.empty
        expect(data.author, "Author doesn't match").to.equal(randomManga.author)

        expect(data.desc, "Missing Description").to.be.not.empty
        expect(data.desc, "Description doesnt match").to.equal(randomManga.desc)
        
        expect(data.titles, "Missing Titles").to.be.not.empty
        expect(data.titles, "Titles doesn't match").to.deep.equal(randomManga.titles)

        expect(data.rating, "Missing Rating").to.exist
        expect(data.rating, "Rating doesn't match").to.equal(randomManga.rating)
        
        expect(data.lastUpdate, "Missing Last Update").to.exist
        expect(data.lastUpdate, "Last Update doesn't match").to.equal(randomManga.lastUpdate)

        expect(data.tags, "Missing Tags").to.exist
        expect(tags, "Tags doesn't match").to.deep.equal(randomManga.tags)
    })

    it("Testing Get Chapters", async () => {
        const data = await wrapper.getChapters(source, mangaId);
        expect(data, "No chapters present for: [" + mangaId + "]").to.not.be.empty;

        const chapter = data[data.length - 1]
        const randomChapter = randomManga.chapters[0]

        expect(chapter.id, "No ID present").to.not.be.empty
        expect(chapter.id, "Chapter ID doesn't match").to.equal(randomChapter.id)

        expect(chapter.mangaId, "No Manga ID present").to.not.be.empty
        expect(chapter.mangaId, "Manga ID doesn't match").to.equal(randomChapter.mangaId)
        
        expect(chapter.name, "No title available").to.not.be.empty
        expect(chapter.name, "Chapter title doesn't match").to.equal(randomChapter.name)

        expect(chapter.chapNum, "No chapter number present").to.exist
        expect(chapter.chapNum, "Chapter Number doesn't match").to.equal(randomChapter.chapNum)

        expect(chapter.time, "No date present").to.exist
        expect(chapter.time, "Time doesn't match").to.deep.equal(randomChapter.time)
    })
    
    it("Testing Get Chapter Details", async () => {
        const chapters = await wrapper.getChapters(source, mangaId);
        const chapter = await wrapper.getChapterDetails(source, mangaId, chapters[chapters.length - 1].id);
        
        const randomChapter = randomManga.chapters[0]

        expect(chapter, "No server response").to.exist;
        expect(chapter, "Empty server response").to.not.be.empty;

        expect(chapter.id, "Missing ID").to.be.not.empty;
        expect(chapter.id, "Chapter ID doesn't match").to.equal(randomChapter.id)

        expect(chapter.mangaId, "Missing MangaID").to.be.not.empty;
        expect(chapter.mangaId, "Manga ID doesn't match").to.equal(randomChapter.mangaId)

        expect(chapter.pages, "No pages present").to.be.not.empty;
    })

    it("Testing search", async () => {
        const testSearch = createSearchRequest({
            title: 'Kawaii'
        });
        
        const search = await wrapper.searchRequest(source, testSearch);
        const result = search.results[0]

        expect(result, "No response from server").to.exist;
        expect(result.id, "No ID found for search query").to.be.not.empty;
        expect(result.image, "No image found for search").to.be.not.empty;
        expect(result.title, "No title").to.be.not.null;
        expect(result.subtitleText, "No subtitle text").to.be.not.null;
    })

    it("Testing Home-Page aquisition", async() => {
        const homePages = await wrapper.getHomePageSections(source)

        const featured = homePages[0]
        const latest = homePages[1]
        const recommended = homePages[2]
        const week = homePages[3]

        expect(homePages, "No response from server").to.exist
        expect(featured, "No featured section available").to.exist
        expect(latest, "No latest section available").to.exist
        expect(recommended, "No recommended section available").to.exist
        expect(week, "No manga of week section available").to.exist
    })

    it("Testing ViewMore aquisition", async() => {
        let viewMore = await wrapper.getViewMoreItems(source, HomeSectionType.FEATURED, {})
        expect(viewMore, "No response from server").to.be.not.empty;
    })
})