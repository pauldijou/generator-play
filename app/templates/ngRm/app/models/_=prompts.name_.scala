package models

import play.api.libs.json._
import play.api.libs.functional.syntax._

case class <%= prompts.name %> ()

object <%= prompts.name %> {
  implicit val format<%= prompts.name %> = Json.format[<%= prompts.name %>]
}