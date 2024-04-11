enum PROMISE_STATE{
    PENDDING="pending",
    FULFILLED="fulfilled",
    REJECTED="rejected"
}

class MyPromise{
    PromiseState: string
    constructor(){
        this.PromiseState = PROMISE_STATE.PENDDING
    }

}

export default MyPromise