package main

import (
	"bufio"
	"fmt"
	"math/rand"
	"os"
	"time"
)

var stdin = bufio.NewReader(os.Stdin)

func inputValue() (int, error) {
	var num int
	var _, err = fmt.Scanln(&num)

	if err != nil {
		stdin.ReadString('\n')
	}

	return num, err
}

func main() {
	rand.Seed(time.Now().UnixNano())

	var answer = rand.Intn(100)
	var count = 1

	fmt.Println("Answer:", answer)

	for {
		fmt.Print("입력한 숫자: ")

		var num, err = inputValue()

		if err != nil {
			fmt.Println("숫자를 입력해 주세요.")
		} else {
			if num > answer {
				fmt.Println("입력한 숫자가 더 큽니다.")
			} else if num < answer {
				fmt.Println("입력한 숫자가 더 작습니다.")
			} else {
				fmt.Println("정답입니다. 시도한 횟수:", count)

				break
			}

			count++
		}		
	}
}