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
            ],
            chapters: [
                {
                    id: '1',
                    mangaId: 'tono-no-kanri-o-shite-miyou-mh17734',
                    name: 'Capítulo 1',
                    chapNum: 1,
                    time: new Date('Jul 07, 2019 00:00:00')
                }
            ]
        },
        {
            id: 'shingeki-no-kyojin-attack-on-titan-mh20253',
            image: 'https://img-host.filestatic1.xyz/mangas_files/shingeki-no-kyojin-attack-on-titan/image_shingeki-no-kyojin-attack-on-titan_full.jpg',
            titles: ['Shingeki no Kyojin (Attack on Titan)', '進撃の巨人', 'Attack on Titan'],
            author: 'Hajime Isayama',
            artist: 'Hajime Isayama',
            status: 0,
            rating: 4.13,
            tags: [
                'acao',
                'drama',
                'fantasia',
                'horror',
                'misterio',
                'shounen',
                'sobrenatural',
                'super poderes'
            ],
            desc: 'Várias centenas de anos atrás, os humanos quase foram exterminados por Titãs. Os Titãs têm vários andares de altura, parecem não ter inteligência, devoram seres humanos e, o pior de tudo, parecem fazer isso pelo prazer e não como fonte de alimento.Avancemos para o presente e a cidade não viu um Titã há mais de 100 anos. O adolescente Eren e sua irmã adotiva Mikasa testemunham algo terrível quando as muralhas da cidade são destruídas por um super Titã que surge de lugar nenhum. Enquanto os Titãs menores inundam a cidade, as duas crianças assistem horrorizadas sua mãe ser comida viva. Eren jura que ele irá matar todos os Titãs e se vingar por toda a humanidade.',
            lastUpdate: 'Apr 07, 2021',
            relatedIds: ['shingeki-no-kyojin-volume-0-mh41418'],
            chapters: [
                {
                    id: '1',
                    mangaId: 'shingeki-no-kyojin-attack-on-titan-mh20253',
                    name: 'Capítulo 1',
                    chapNum: 1,
                    time: new Date('Feb 18, 2013 00:00:00')
                }
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
    
    const mangaId = randomManga.id

    it('Retrieve Manga Details', async () => {
        const details = await wrapper.getMangaDetails(source, mangaId)
        expect(details, "No results found with test-defined ID [" + mangaId + "]").to.exist

        const data = details
        const tags: string[] = data.tags?.length == 1 ? data.tags[0].tags.map(tag => tag.label) : []

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

    it("Get Chapters", async () => {
        const data = await wrapper.getChapters(source, mangaId);

        expect(data, "No chapters present for: [" + mangaId + "]").to.not.be.empty;

        const chapter = data[data.length - 1]
        const testChapter = randomManga.chapters[0]

        console.log(logTest(chapter.id, testChapter.id))
        console.log(logTest(chapter.mangaId, testChapter.mangaId))
        console.log(logTest(chapter.name, testChapter.name))
        console.log(logTest(chapter.chapNum, testChapter.chapNum))
        console.log(logTest(chapter.time, testChapter.time))


        expect(chapter.id, "No ID present").to.not.be.empty
        expect(chapter.id, "Chapter ID doesn't match").to.equal(testChapter.id)

        expect(chapter.mangaId, "No Manga ID present").to.not.be.empty
        expect(chapter.mangaId, "Manga ID doesn't match").to.equal(testChapter.mangaId)
        
        expect(chapter.name, "No title available").to.not.be.empty
        expect(chapter.name, "Chapter title doesn't match").to.equal(testChapter.name)

        expect(chapter.chapNum, "No chapter number present").to.exist
        expect(chapter.chapNum, "Chapter Number doesn't match").to.equal(testChapter.chapNum)

        expect(chapter.time, "No date present").to.exist
        expect(chapter.time, "Time doesn't match").to.deep.equal(testChapter.time)

    })
    
    it("Get Chapter Details", async () => {

        const chapters = await wrapper.getChapters(source, mangaId);
        const chapter = await wrapper.getChapterDetails(source, mangaId, chapters[0].id);

        expect(chapter, "No server response").to.exist;
        expect(chapter, "Empty server response").to.not.be.empty;

        expect(chapter.id, "Missing ID").to.be.not.empty;
        expect(chapter.mangaId, "Missing MangaID").to.be.not.empty;
        expect(chapter.pages, "No pages present").to.be.not.empty;

        expect(chapter.mangaId, "Manga ID doesn't match").to.equal(randomManga.id)
    })

})