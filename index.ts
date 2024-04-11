enum PROMISE_STATE {
    PENDDING = "pending",
    FULFILLED = "fulfilled",
    REJECTED = "rejected"
}

type resolve<T> = {
    (): void
    (value?: T): void
}
type reject<T> = {
    (): void
    (reson?: T): void
}
type value<T> = null | T
type reson<T> = null | T

interface onFulfilled<T = any, R = any> {
    (resolve?: value<T> | null): R
}
interface onRejected<T = any, R = any> {
    (reson?: reson<T>): R
}


class MyPromise<T = undefined>{
    resolve: resolve<T>
    reject: reject<T>
    PromiseState: string
    value?: value<T>;
    reson?: reson<T>;
    onFulfilledCb: onFulfilled[]
    onRejectedCb: onRejected[]


    constructor(executor?: (resolve: resolve<T>, reject: reject<T>) => any) {
        this.PromiseState = PROMISE_STATE.PENDDING;
        this.value = null;
        this.reson = null;
        this.onFulfilledCb = []
        this.onRejectedCb = []

        this.reject = (reject?: T) => {
            if (this.PromiseState !== PROMISE_STATE.PENDDING) return;
            this.PromiseState = PROMISE_STATE.REJECTED

            this.reson = reject;
            this.onRejectedCb.forEach(cb => queueMicrotask(cb))
        }
        this.resolve = (value?: T) => {
            if (this.PromiseState !== PROMISE_STATE.PENDDING) return;
            this.PromiseState = PROMISE_STATE.FULFILLED

            this.value = value
            this.onFulfilledCb.forEach(cb => queueMicrotask(() => cb()))
        }
        try {
            executor&&executor(this.resolve, this.reject)
        } catch (err) {
            this.reject(err as any)
        }
    }


    then<R>(onFulfilled?: onFulfilled<T, R>, onRejected?: onRejected<T, R>): MyPromise<R | undefined> {
        if (typeof onFulfilled !== 'function' && this.PromiseState === PROMISE_STATE.FULFILLED) return new MyPromise((res) => res())
        if (typeof onRejected !== 'function' && this.PromiseState === PROMISE_STATE.REJECTED) return new MyPromise((res) => res())

        return new MyPromise((resolve, reject) => {
            if (this.PromiseState === PROMISE_STATE.FULFILLED && typeof onFulfilled == 'function') {
                try {
                    const value = onFulfilled(this.value)
                    resolve(value)
                } catch (error) {
                    reject(error as any)
                }
            } else if (this.PromiseState === PROMISE_STATE.REJECTED && typeof onRejected == 'function') {
                try {
                    const reson = onRejected(this.reson)
                    resolve(reson)
                } catch (error) {
                    reject(error as any)
                }
            } else if (this.PromiseState === PROMISE_STATE.PENDDING) {
                onFulfilled ?? this.onFulfilledCb.push(onFulfilled!)
                onRejected ?? this.onRejectedCb.push(onRejected!)
            }
        })
    }
}
const p = new MyPromise<number>((res)=>res(1));
console.log(p)
p.then(res=>{
    console.log("test===>",res)
    return 2
}).then(res=>{
    console.log("ok了烙铁",res)
})
p.then(res=>{
    console.log("test===>",res)
})

export default MyPromise