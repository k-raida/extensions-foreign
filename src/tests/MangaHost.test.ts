import cheerio from 'cheerio'
import { APIWrapper, Source } from 'paperback-extensions-common'
import { MangaHost } from '../MangaHost/MangaHost'

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
            tags: [
                'acao', 
                'aventura',
                'ecchi',
                'fantasia',
                'harem',
                'romance',
                'shounen'
            ],
            desc: 'Kosuke é um adolescente normal que de repente se encontra em um campo desconhecido, sem saber onde ele está, mas de repente aparece uma misteriosa mulher que sabia seu nome, ela pergunta se ele poderia acompanhá-la até onde sua mestra se encontra. Kosuke a segue e se encontra com essa tal mestra, seu nome é Asura, uma bela mulher cativante.',
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

        // Validate that the fields are filled
        let data = details;
        expect(data.id, "Missing ID").to.be.not.empty;
        console.log('id: ', data.id)
        expect(data.image, "Missing Image").to.be.not.empty;
        console.log('image: ', data.image)
        expect(data.status, "Missing Status").to.exist;
        console.log('status: ', data.status, typeof data.status)
        expect(data.author, "Missing Author").to.be.not.empty;
        console.log('author: ', data.author)
        expect(data.desc, "Missing Description").to.be.not.empty;
        console.log('description: ', data.desc)
        expect(data.titles, "Missing Titles").to.be.not.empty;
        console.log('titles: ', data.titles)
        expect(data.rating, "Missing Rating").to.exist;
        console.log('rating: ', data.rating)

        console.log('artist: ', data.artist)
        console.log('views: ', data.views)
        console.log('relatedIds: ', data.relatedIds)
        console.log('tags: ', data.tags)
        console.log('langName: ', data.langName)
        console.log('langFlag: ', data.langFlag)
        console.log('lastUpdate: ', data.lastUpdate)

        console.log('tags length:', data.tags?.length)

        if (data.tags?.length) {
            console.log(data.tags[0].id)
            console.log(data.tags[0].label)
            console.log(data.tags[0].tags)
            console.log(data.tags[0].tags.map(
                tag => tag.label
            ))
        }
    })
})