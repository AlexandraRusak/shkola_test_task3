import "./style.css"

function $(selector) {
    return document.querySelector(selector)
}

function addHTML(string) {
    $("#root").insertAdjacentHTML("beforeend", string);
}

function feedCats() {

    $("#root").innerHTML = "";

    const cats = document.querySelector("#cats").value

    if (Number(cats)===0) {
        addHTML(`<p class="warning">0 голодных котов</p>`)
        $(".btn").disabled = false;
        document.querySelectorAll("input").forEach(el => el.disabled = false)
        return null
    }

    let fedCats = 0
    let currentCat = fedCats + 1

    const amountForCat = document.querySelector("#food").value
    let amountInBowl = document.querySelector("#food-bowl").value
    let amountLeft = amountInBowl


    let isCatEating = true;
    let isOldLadyFilling = false;

    const fillInBowl = Number(document.querySelector("#fill-in-bowl").value) * 1000
    const eatFood = Number(document.querySelector("#eat-food").value) * 1000

    let lastEventBegin = performance.now();
    let startTime = Date.now()

    addHTML(`<p>Кот №${currentCat} подошел к миске</p>`)

    requestAnimationFrame(function cat(time) {
        if (isCatEating) {
            if ((lastEventBegin + eatFood) < time) {
                addHTML(`<p>Кот №${currentCat} отошел от миски.</p>`)
                amountLeft = amountInBowl - amountForCat
                isCatEating = false
                fedCats++
                currentCat++
                if (amountLeft < amountForCat&&fedCats<cats) {
                    addHTML('<p>Бабушка начала наполнять миску.</p>')
                    isOldLadyFilling = true
                    lastEventBegin = (lastEventBegin + eatFood)
                } else if (amountForCat>=amountLeft&&fedCats<cats) {
                    addHTML(`<p>Кот №${currentCat} подошел к миске.</p>`)
                    isCatEating = true
                    lastEventBegin = (lastEventBegin + eatFood)
                }
            }
        }
        if (isOldLadyFilling) {
            if ((lastEventBegin + fillInBowl) < time) {
                addHTML('<p>Бабушка закончила наполнять миску.</p>')
                lastEventBegin = (lastEventBegin + fillInBowl)
                amountLeft = amountInBowl
                isOldLadyFilling = false
                isCatEating = true
                addHTML(`<p>Кот №${currentCat} подошел к миске.</p>`)
            }
        }
        if (fedCats < cats) {
            requestAnimationFrame(cat)
        } else {
            addHTML(`<p class="complete-message">Все коты накормлены!</p>`)
            const endTime = Date.now()
            addHTML(`<p class="resulting-time">На кормление котов потрачено ${(endTime - startTime)/1000} секунд</p>`)
            $(".btn").disabled = false;
            document.querySelectorAll("input").forEach(el => el.disabled = false)
        }
    })
}

document.querySelector("#form").addEventListener("submit", (event) => {
    event.preventDefault()
    $("#root").innerHTML = ""
    if (Number($("#food").value) > Number($("#food-bowl").value)) {
        addHTML(`<p class="warning">Еды в миске должно быть больше, чем порция для кота.</p>`)
        return null
    }

    $(".btn").disabled = true;
    document.querySelectorAll("input").forEach(el => el.disabled = true)
    feedCats()
})