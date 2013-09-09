app.factory("<%= name %>s", ["Restangular", function (Restangular) {
  
  // Will do a GET at "/<%= name %>s" and return a promise
  // which will return a JSON array when resolved
  function all() {
    return Restangular.all("<%= name.toLowerCase() %>s").getList();
  }

  // Will do a GET at "/<%= name %>s/:id" and return a promise
  // which will return a JSON object when resolved
  function findById(id) {
    return Restangular.one("<%= name.toLowerCase() %>s", id).get();
  }

  function create(value) {
    return Restangular.all("<%= name.toLowerCase() %>s").post(value);
  }

  function update(id, value) {
    if (!value) {
      value = id;
      id = value.id;
    }

    return Restangular.one("<%= name.toLowerCase() %>s", id).customPUT(value);
  }

  function remove(value) {
    return Restangular.one("<%= name.toLowerCase() %>s", value.id || value).remove();
  }

  return {
    all: all,
    findById: findById,
    create: create,
    update: update,
    remove: remove
  };
}])