import axios from "axios";
export const fetchGithubRepositories = async (perPage, search, page) => {
    try {
        const response = await axios.get('https://api.github.com/search/repositories', {
            params: {
                q: search.length > 0 ? search : 'stars:>1',
                page: page,
                sort: 'stars',
                order: 'desc',
                per_page: perPage,
            },
        });

        if (page > 100) {

        }

        const {items, total_count} = response.data;
        const totalPages = search.length > 0 ? Math.ceil(total_count / perPage) : 0;
        const ReducedTotalPages = totalPages > 11 ? 10 : totalPages; //THIS IS INSINCERE TO 10 PAGES
        return {items, ReducedTotalPages};
    } catch (error) {
        console.error(error);
        if(error.response.status === 403){
            console.error('Too much requests');
        }
        throw new Error('Failed to search repositories');
    }
}