json.set! track.id do
    json.extract! track,
        :title,
        :description,
        :genre,
        :created_at,
        :updated_at
end