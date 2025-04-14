package main

import "fmt"

func main() {
	const secondsToMinute = 60
	const minutedToHour = 60
	const secondsInHour = minutedToHour * secondsToMinute

	fmt.Println("result:", secondsInHour)
}
