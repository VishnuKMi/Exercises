const mark = {
    fullName: 'Mark Miller',
    mass: 78,
    height: 1.69,

    calcBmi: function() {
        return this.mass / this.height **2 //here this = mark
    }
}

const john = {
    fullName: 'John Smith',
    mass: 92,
    height: 1.95,

    calcBmi: function() {
        return this.mass / this.height **2 //here this = john
    }
}

console.log(`${mark.fullName}'s BMI (${mark.calcBmi()}) ${mark.calcBmi() > john.calcBmi() ? 'is' : 'is not'} higher than ${john.fullName}'s (${john.calcBmi()})`)

