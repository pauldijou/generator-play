app.factory("<%= prompts.name %>s", ["Restangular", function (Restangular) {
  
  // Will do a GET at "/<%= prompts.name %>s" and return a promise
  // which will return a JSON array when resolved
  function all() {
    return Restangular.all("<%= prompts.name.toLowerCase() %>s").getList();
  }

  // Will do a GET at "/<%= prompts.name %>s/:id" and return a promise
  // which will return a JSON object when resolved
  function findById(id) {
    return Restangular.one("<%= prompts.name.toLowerCase() %>s", id).get();
  }

  function create(value) {
    return Restangular.all("<%= prompts.name.toLowerCase() %>s").post(value);
  }

  function update(id, value) {
    if (!value) {
      value = id;
      id = value.id;
    }

    return value.put && value.put() || Restangular.one("<%= prompts.name.toLowerCase() %>s", id).customPUT(value);
  }

  function remove(value) {
    return Restangular.one("<%= prompts.name.toLowerCase() %>s", value.id || value).remove();
  }

  return {
    all: all,
    findById: findById,
    create: create,
    update: update,
    remove: remove
  };
}])