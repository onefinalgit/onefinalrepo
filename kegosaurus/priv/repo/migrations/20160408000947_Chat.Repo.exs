defmodule Chat.Repo.Migrations.Chat.Repo do
  use Ecto.Migration

  def up do
    create table( :apartments, primary_key: true ) do
      add :url,             :string, size: 255
      add :title,           :string, size: 255
      add :cost_per_night,  :int
      add :fees,            :int
      add :br,              :int
      add :bath,            :int
    end
  end

  def down do
    drop table( :apartments )
  end
end
