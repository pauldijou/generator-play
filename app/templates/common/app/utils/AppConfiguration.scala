package utils

case class AppConfiguration(version: String, styleName: String, scriptName: String)

object AppConfiguration {
  def apply(conf: play.api.Configuration) {
    new AppConfiguration(
      version = conf.getString("application.version").getOrElse(""),
      styleName = conf.getString("application.files.style").getOrElse(""),
      scriptName = conf.getString("application.files.script").getOrElse("")
    )
  }
}