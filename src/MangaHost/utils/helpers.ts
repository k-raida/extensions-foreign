import {
    Tag,
    TagSection
} from 'paperback-extensions-common'


export const getMetaInfo = (scrapedContent: string): string => {
    const regex = /(?<=\:\s).+/
    const match = scrapedContent.match(regex) ?? ''
    const result = match.toString().trim()
    return result
}

export const getAlternativeTitles = (scrapedContent: string): string[] => {
    const regex = /.*(?=Ativo|Completo)/
    const match = scrapedContent.match(regex) ?? ''
    const result = match.toString().trim()

    if (result?.includes(',')) {
        return result.split(',').map(title => title.trim())
    }
    return [result];
}

export const getChapterDate = (scrapedContent: string): string => {
    const regex = /(?<=Adicionado\sem\s).+/
    const match = scrapedContent.match(regex) ?? ''
    const result = match.toString().trim()
    return result
}

export const getTagSection = ($: CheerioStatic, elements: CheerioElement[]): TagSection[] => {
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

export const getWeekMangaImage = (src: string): string => {
    // src: /wp-content/themes/mangahost/img/destaque/iris-zero.jpg
    const imageName: string = src.split('/').pop()?.split('.').shift() ?? '' // get "iris-zero"
    return `https://img-host.filestatic1.xyz/mangas_files/iris-zero/image_${imageName}_xmedium.jpg`
}

export const logTest = (expect: any, got: any, expectLabel: string = 'Expect', gotLabel: string = 'Got',): string => {
    return `
    -----------
    ${expectLabel}: ${expect}
    ${gotLabel}: ${got}
    -----------`
}
