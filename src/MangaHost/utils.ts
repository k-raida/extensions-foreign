
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

export const getLastUpdate = (scrapedContent: string): string => {
    const regex = /(?<=Adicionado\sem\s).+/
    const match = scrapedContent.match(regex) ?? ''
    const result = match.toString().trim()
    return result
}

export const logTest = (expect: any, actual: any, expectLabel: string = 'Expect', actualLabel: string = 'Actual'): string => {
    return `
    -----------
    ${expectLabel}: ${expect}
    ${actualLabel}: ${actual}
    -----------`
}