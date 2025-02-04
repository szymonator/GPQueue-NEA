//notes
// quite similar to python OOP, but self -> this
// this.items is the stacks items, stored as an array
// arrays have a length attribute which i can call on this.items.length

export default class Stack {
    
    constructor(){
        this.items = [];
    }

    isEmpty(){
        return (this.items.length === 0)
    }

    push(val){
        this.items[this.items.length] = val;
    }

    pop(){
        if (this.isEmpty()) {
            throw new Error('Stack is empty!')
        } else {
            const rear = this.items[this.items.length-1]
            this.items.length = this.items.length -1
            return rear
        }
    }

    peek(){
        if (this.isEmpty()) {
            throw new Error('Stack is empty!')
        } else {
            return this.items[this.items.length-1]
        }
    }

    purge(){
        while (true) {
            if (this.isEmpty()) {
                return
            } else {
                this.items.pop()
            }
        }
    }
}
