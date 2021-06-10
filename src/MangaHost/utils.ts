
const getMetaInfo = (scrapedContent: string): string => {
    const regex = /(?<=\:\s).+/
    const match = scrapedContent.match(regex)
    const result = match.toString().trim()
    return result
}

const getAlternativeTitles = (scrapedContent: string): string[] => {
    const regex = /.*(?=Ativo|Completo)/
    const match = scrapedContent.match(regex)
    const result = match.toString().trim()
    
    if (result.includes(',')) {
        return result.split(',').map(title => title.trim())
    }

    return [result];
}