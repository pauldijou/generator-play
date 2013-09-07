package models

import play.modules.reactivemongo.json.collection.JSONCollection

trait JsonModel {
  def collectionJson: JSONCollection
}