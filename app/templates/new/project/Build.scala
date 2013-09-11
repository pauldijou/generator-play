import sbt._
import Keys._
import play.Project._

object ApplicationBuild extends Build {

  val appName         = "<%= global.app.name %>"
  val appVersion      = "<%= global.app.version %>"

  val appDependencies = Seq(
    // Add your project dependencies here,
    <%= global.app.dependencies.join(',\n    ') %>
  )

  val main = play.Project(appName, appVersion, appDependencies).settings(
    // Add your own project settings here      
  )

}
