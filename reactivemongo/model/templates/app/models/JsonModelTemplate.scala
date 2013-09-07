package models

import play.modules.reactivemongo.json.collection.JSONCollection
<%= imports %>

case class <%= nameCap %> (
  <%= fields %>
) {

}

object <%= nameCap %> extends JsonModel <%= with %> {
  lazy val collectionJson: JSONCollection = db[JSONCollection](<%= name %>)

  implicit val <%= name %>Format = Json.format[<%= nameCap %>]

  def toJson(<%= name %>: <%= nameCap %>): JsValue = Json.toJson(<%= name %>)
  def stringify(<%= name %>: <%= nameCap %>): String = toJson(<%= name %>).toString
}