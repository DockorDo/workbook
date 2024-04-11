import { expect, test } from 'vitest'
import MyPromise from '..'
import { vi } from 'vitest'



test('A promise must be in one of three state:pending,fulfilled or rejected', () => {
    const myPromise = new MyPromise()
    expect(["pending", "fulfilled", "rejected"].includes(myPromise.PromiseState)).toBeTruthy()
})

test("A promise status is established, it cannot be changed", () => {
    const myPromise1 = new MyPromise((resolve, reject) => {
        resolve();
        reject();
    });
    expect(myPromise1.PromiseState).toEqual("fulfilled")

    const myPromise2 = new MyPromise((resolve, reject) => {
        reject();
        resolve();
    });
    expect(myPromise2.PromiseState).toEqual("rejected")
})

test("promise is an object with a then method", () => {
    const myPromise = new MyPromise()
    expect(myPromise.then).toBeDefined();

    test("the then method accepts two arguments,when status is fulfilled called onFulfilled", () => {
        const onFulfilled = vi.fn(() => void 0)
        const onRejected = vi.fn(() => void 0)
        expect(onFulfilled).toHaveBeenCalledTimes(0);
        const myPromise = new MyPromise((resolve, reject) => {
            resolve();
        })
        myPromise.then(onFulfilled, onRejected);
        expect(onFulfilled).toHaveBeenCalled();
        expect(onFulfilled).toHaveBeenCalledTimes(1);
        expect(onRejected).toHaveBeenCalledTimes(0);
    })
    test("the then method accepts two arguments,when status is rejected called onRejected", () => {
        const onFulfilled = vi.fn(() => void 0)
        const onRejected = vi.fn(() => void 0)
        expect(onRejected).toHaveBeenCalledTimes(0);
        const myPromise = new MyPromise((resolve, reject) => {
            reject();
        })
        myPromise.then(onFulfilled, onRejected);
        expect(onRejected).toHaveBeenCalled();
        expect(onRejected).toHaveBeenCalledTimes(1);
        expect(onFulfilled).toHaveBeenCalledTimes(0);
    })
    test("then may be called multiple times on the same promise",()=>{
        
    })
    test("the then method must return a promise", () => {
        const myPromise = new MyPromise()
        expect(myPromise.then()).toBeInstanceOf(MyPromise)
    })
    test("then may be called multiple times on the same promise.",async ()=>{
        const myPromise = new MyPromise((resolve,reject)=>{
            resolve(1)
        })
       await expect( myPromise.then((res)=>res+1)).resolves.toEqual(2)
       await expect( myPromise.then((res)=>res+1)).resolves.toEqual(2)
    })
})
