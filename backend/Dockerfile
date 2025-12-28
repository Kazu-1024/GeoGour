FROM golang:1.25.5-bookworm

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

# ホットリロード(air)
RUN go install github.com/air-verse/air@latest

CMD ["air", "-c", ".air.toml"]