module.exports.isValidEmail = (email) => (new RegExp(/^\S+@\S+\.\S+$/)).test(email);

module.exports.convertToLinks = (protocol, host, path, limit, page, totalPages) => {
  const link = {
    first: page === 1 ? '' : `${protocol}://${host}/${path}?limit=${limit}&page=1`,
    next: page === totalPages ? '' : `${protocol}://${host}/${path}?limit=${limit}&page=${Number(page) + 1}`,
    prev: page === 1 ? '' : `${protocol}://${host}/${path}?limit=${limit}&page=${Number(page) - 1}`,
    last: page === totalPages ? '' : `${protocol}://${host}/${path}?limit=${limit}&page=${totalPages}`,
  };
  return link;
};
