import { useEffect, useState } from "react";

// no validation cause this is just a prototype, permanent prototype.
export type Snippet = {
    title: string,
    tag: string[],
    categories: [string, string] | [string, string, string],
    segments : string[],
}
const PATH = '/snippet.json';
function distinctBy<T>(arr: T[], mapFn: (elem: T) => string): T[] {
    const set = new Set<string>();
    return arr.filter(elem => {
        if (set.has(mapFn(elem))) return false;
        set.add(mapFn(elem));
        return true;
    })
}
export function useSnippets() {
    const [state, setState] = useState<{categories: string[][], snippets: Snippet[]}>({categories: [], snippets: []})
    useEffect(() => {
        (async () => {
            const res = await fetch(PATH);
            const snippets: Snippet[] = await res.json();
            const categories = distinctBy(snippets.map(x=>x.categories), categories => categories.slice(0, 2).join());
            setState({snippets, categories})
        })()
    }, [])
    return state;
}