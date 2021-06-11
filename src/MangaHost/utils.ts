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

export const logTest = (got: any, expect: any, gotLabel: string = 'Got', expectLabel: string = 'Expect'): string => {
    return `
    -----------
    ${gotLabel}: ${got}
    ${expectLabel}: ${expect}
    -----------`
}
