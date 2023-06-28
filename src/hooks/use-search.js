import {useSelector} from "react-redux";

export function useSearch() {
    const {search, status, page, searchSafer} = useSelector(state => state.user);

    return {
        search, status, page, searchSafer
    };
}