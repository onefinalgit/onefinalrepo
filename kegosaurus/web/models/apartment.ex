defmodule Chat.Apartment do
  use Ecto.Model

  schema "apartments" do
    field :url,             :string
    field :title,           :string
    field :cost,            :integer
    field :comment,         :string
  end
end
