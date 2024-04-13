export function getQueryOptions(query: any) {
    const page = query.page * 1 || 1;
    const limit = query.limit * 1 || 10;
    const skip = (page - 1) * limit;
    let sort: any = {};
    if(query.sortBy) {
        let queryData: any = JSON.parse(query.sortBy);
        let arrayFinal: any = [];
        for (const [key, value] of Object.entries(queryData)) {
            if(value === 1){
                arrayFinal.push([key, 'ASC'])
            }else{
                arrayFinal.push([key, 'DESC'])
            }
        }
        sort = arrayFinal
    }else{
        sort = [['createdAt', 'DESC']]
    }
    return {limit, skip, sort, page}
}