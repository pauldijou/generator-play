package models

import play.api.libs.json._
import play.api.libs.functional.syntax._

case class <%= name %> ()

object <%= name %> {
  implicit val format<%= name %> = Json.format[<%= name %>]
}