package main

import (
	"fmt"
	"math/rand"
	"time"
)

func main() {
	rand.Seed(time.Now().UnixNano())

	var num = rand.Intn(100)

	fmt.Println(num)
}