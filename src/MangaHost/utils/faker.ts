

interface FakeChapter {
    id: string
    mangaId: string
    name: string
    chapNum: number | typeof NaN
    time: Date
}

interface FakeManga {
    id: string
    image: string
    titles: string[]
    author: string
    artist: string
    status: 0 | 1
    rating: number
    tags: string[]
    desc: string
    lastUpdate: string
    relatedIds: string[]
    chapters: FakeChapter[]
}


export const fakeMangas: FakeManga[] = [
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