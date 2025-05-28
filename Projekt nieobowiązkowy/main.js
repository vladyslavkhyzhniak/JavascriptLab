const testData = [];
for (let i = 0; i < 100; i++) {
    testData.push(i + 1);
}

const asyncAdd = async (a, b) => {
    if (typeof a !== 'number' || typeof b !== 'number') {
        return Promise.reject('Argumenty muszą mieć typ number!');
    }
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(a + b);
        }, 100);
    });
};

async function asyncSuma(numbers) {
    let result = 0;
    let asyncOperationsCount = 0
    for (let number of numbers) {
        try {
            result = await asyncAdd(result, number);
            asyncOperationsCount++;
        } catch (error) {
            throw error;
        }
    }
    return { result, asyncOperationsCount };
}

async function asyncSuma2(numbers) {
    let asyncOperationsCount = 0

    async function sumPair(arr) {
        if (arr.length == 1) {
            return arr[0]
        }
        const promises = []
        for (let i = 0; i < arr.length; i += 2) {
            if (arr[i + 1] == undefined) {
                promises.push(+arr[i])
            } else {
                asyncOperationsCount++;
                promises.push(asyncAdd(+arr[i], +arr[i + 1]));
            }
        }
        const results = await Promise.all(promises);
        return sumPair(results);
    }
    const result = await sumPair(numbers);
    return { result, asyncOperationsCount };

}

async function measureTime(asyncFunc) {
    performance.now()
    performance.mark('start')
    const { result, asyncOperationsCount } = await asyncFunc(testData);
    performance.mark('end')
    const measure = performance.measure("Czas wykonania", 'start', 'end');
    return {
        result,
        timeMs: measure.duration,
        asyncOperationsCount
    }
}

async function Start(Func) {
    const { result, timeMs, asyncOperationsCount } = await measureTime(Func);
    console.log("Czas", timeMs, 'ms', '&', "ilość operacji", asyncOperationsCount, 'Wynik dodawania', result);
}

Start(asyncSuma);
Start(asyncSuma2)