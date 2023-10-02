const paginationVariables = (req, total) => {
    const [page, limit, pagination] = [(!(req.query.page && req.query.page.match(/^\d+$/)) ? 1 : parseInt(req.query.page)), 10, {}];
    const [startIndex, endIndex] = [(page - 1) * limit, page * limit];
    if (startIndex > 0) {
        pagination.prev = {
            page: page - 1,
            limit
        }
    }
    if (endIndex < total) {
        pagination.next = {
            page: page + 1,
            limit
        }
    }
    return {
        pagination,
        startIndex,
        limit
    }
}
module.exports = {
    pagination: async (model, query, req) => {
        const total = await model.countDocuments();
        const {pagination, startIndex, limit} = paginationVariables(req, total);
        return {
            data: await query.skip(startIndex).limit(limit),
            total: total,
            pagination: Object.keys(pagination).length === 0 ? undefined : pagination
        };
    }
}
