defmodule Chat.Apartment do
  use Ecto.Model

  schema "apartments" do
    field :url,             :string
    field :title,           :string
    field :cost_per_night,  :integer
    field :fees,            :integer
    field :br,              :integer
    field :bath,            :integer
  end
end
