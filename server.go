package main

import (
	"fmt"
	"log"
	"net/http"
)

const AddressToServe = "localhost:6060"
const PublicDir = "./public/"

func main() {
	serveMux := http.NewServeMux()
	serveMux.Handle("/", http.FileServer(http.Dir(PublicDir)))
	fmt.Println("Starting server!")
	err := http.ListenAndServe(AddressToServe, serveMux)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Server closed!")
}
