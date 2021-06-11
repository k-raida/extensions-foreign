import cheerio from 'cheerio'
import { APIWrapper, Source } from 'paperback-extensions-common'
import { MangaHost } from '../MangaHost/MangaHost'
import { logTest } from '../MangaHost/utils'

describe('MangaHost Tests', function () {

    var wrapper: APIWrapper = new APIWrapper()
    var source: Source = new MangaHost(cheerio)
    var chai = require('chai'), expect = chai.expect, should = chai.should()
    var chaiAsPromised = require('chai-as-promised')
    chai.use(chaiAsPromised)

    const mangas = [
        {
            id: 'tono-no-kanri-o-shite-miyou-mh17734',
            image: 'https://img-host.filestatic1.xyz/mangas_files/tono-no-kanri-o-shite-miyou/image_tono-no-kanri-o-shite-miyou_full.jpg',
            titles: ['Tono no Kanri o Shite Miyou', '塔の管理をしてみよう'],
            author: 'Hayakaze',
            artist: 'Roh-en, Yukikasa',
            status: 1,
            rating: 4.84,
            views: 14798,
            tags: [
                'acao', 
                'aventura',
                'ecchi',
                'fantasia',
                'harem',
                'romance',
                'shounen'
            ],
            desc: 'Kosuke é um adolescente normal que de repente se encontra em um campo desconhecido, sem saber onde ele está, mas de repente aparece uma misteriosa mulher que sabia seu nome, ela pergunta se ele poderia acompanhá-la até onde sua mestra se encontra. Kosuke a segue e se encontra com essa tal mestra, seu nome é Asura, uma bela mulher cativante.\nAsura diz a Kosuke que ele está atualmente morto e que ele tem duas opções, pode escolher entre ser reencarnado ou ser invocado, qual escolha Kosuke irá fazer?',
            lastUpdate: 'Jun 09, 2021',
            relatedIds: [
                '29-sai-dokushin-wa-isekai-de-jiyuu-ni-ikita-katta-mh22037',
                'abyss-calling-mh36226',
                'aka-akatoshitachi-no-monogatari-mh60019',
                'ankoku-kishi-monogatari-yuusha-wo-taosu-tameni-maou-ni-shoukansaremashita-novel-mh29350'
            ]
        }
    ]

    /**
     * The Manga ID which this unit test uses to base it's details off of.
     * Try to choose a manga which is updated frequently, so that the historical checking test can 
     * return proper results, as it is limited to searching 30 days back due to extremely long processing times otherwise.
     */

    const randomNumber: number = Math.floor(Math.random() * mangas.length)

    const randomManga = mangas[randomNumber]
    
    var mangaId = randomManga.id

    it('Retrieve Manga Details', async () => {
        let details = await wrapper.getMangaDetails(source, mangaId)
        expect(details, "No results found with test-defined ID [" + mangaId + "]").to.exist

        let data = details

        expect(data.id, "Missing ID").to.be.not.empty
        expect(data.id).to.equal(randomManga.id)

        expect(data.image, "Missing Image").to.be.not.empty
        expect(data.image).to.equal(randomManga.image)
    
        expect(data.status, "Missing Status").to.exist
        expect(data.status).to.equal(randomManga.status)

        expect(data.author, "Missing Author").to.be.not.empty
        expect(data.author).to.equal(randomManga.author)

        expect(data.desc, "Missing Description").to.be.not.empty
        expect(data.desc).to.equal(randomManga.desc)
        
        expect(data.titles, "Missing Titles").to.be.not.empty
        expect(data.titles).to.deep.equal(randomManga.titles)

        expect(data.rating, "Missing Rating").to.exist
        expect(data.rating).to.equal(randomManga.rating)
        
        expect(data.lastUpdate, "Missing Last Update").to.exist
        expect(data.lastUpdate).to.equal(randomManga.lastUpdate)

        const tags: string[] = data.tags?.length == 1 ? data.tags[0].tags.map(tag => tag.label) : []
        expect(data.tags, "Missing Tags").to.exist
        expect(tags, "Tags doesn't match").to.deep.equal(randomManga.tags)

        console.info(logTest(data.id, randomManga.id))
        console.info(logTest(data.image, randomManga.image))
        console.info(logTest(data.status, randomManga.status))
        console.info(logTest(data.rating, randomManga.rating))
        console.info(logTest(data.lastUpdate, randomManga.lastUpdate))
        console.info(logTest(data.titles, randomManga.titles))
        console.info(logTest(data.author, randomManga.author))
        console.info(logTest(data.artist, randomManga.artist))
        console.info(logTest(data.desc, randomManga.desc))
        console.info(logTest(tags, randomManga.tags))
        
    })

    it("Get Chapters", async () => {
        let data = await wrapper.getChapters(source, mangaId);

        expect(data, "No chapters present for: [" + mangaId + "]").to.not.be.empty;

        let entry = data[0]
        expect(entry.id, "No ID present").to.not.be.empty;
        // expect(entry.time, "No date present").to.exist
        expect(entry.name, "No title available").to.not.be.empty
        expect(entry.chapNum, "No chapter number present").to.exist
    })

    it("Get Chapter Details", async () => {

        let chapters = await wrapper.getChapters(source, mangaId);
        let data = await wrapper.getChapterDetails(source, mangaId, chapters[0].id);

        expect(data, "No server response").to.exist;
        expect(data, "Empty server response").to.not.be.empty;

        expect(data.id, "Missing ID").to.be.not.empty;
        expect(data.mangaId, "Missing MangaID").to.be.not.empty;
        expect(data.pages, "No pages present").to.be.not.empty;
    })

})