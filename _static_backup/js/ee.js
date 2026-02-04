let cards = null;
let selectedCard = null;
let selectedCardHtml = null;
let occasion = null;
let occasionCards = null;

async function loadMetaData() {
    try {
        const response = await fetch('./metadata/metadata.json');
        const data = await response.json();
        cards = data.cards;

        if (data.title) {
            document.getElementById('title').innerText = data.title;
        }

        // give the user options to choose from for occasion
        showOccasion();
    } catch (error) {
        console.error('Error loading metadata:', error);
        document.getElementById('modal-body').innerHTML = `
            <div class="alert alert-danger" role="alert">
                حدث خطأ أثناء تحميل البيانات. الرجاء المحاولة مرة أخرى.
            </div>
        `;
    }
}

function showOccasion() {
    document.getElementById('modal-body').innerHTML = '';
    document.getElementById('downloadButton').style.display = 'none';

    document.getElementById('modal-body').innerHTML = `
    <div class="container px-4">
        <div id="0" class="card mb-3" data-img-link="https://saud.imgix.net/cardsImg/ram1.jpeg" data-title="رمضان">
            <a href="#" onclick="selectOccasion(1)" class="text-decoration-none text-dark">
                <div class="card-body d-flex justify-content-center align-items-center py-3">
                    <h5 class="card-title m-0">رمضان</h5>
                </div>
            </a>
        </div>

        <div id="1" class="card mb-3" data-img-link="https://saud.imgix.net/cardsImg/eidf1.jpeg" data-title="عيد الفطر">
            <a href="#" onclick="selectOccasion(2)" class="text-decoration-none text-dark">
                <div class="card-body d-flex justify-content-center align-items-center py-3">
                    <h5 class="card-title m-0">عيد الفطر</h5>
                </div>
            </a>
        </div>

        <div id="2" class="card mb-3" data-img-link="https://saud.imgix.net/cardsImg/bg1-2.jpg" data-title="عيد الأضحى">
            <a href="#" onclick="selectOccasion(3)" class="text-decoration-none text-dark">
                <div class="card-body d-flex justify-content-center align-items-center py-3">
                    <h5 class="card-title m-0">عيد الأضحى</h5>
                </div>
            </a>
        </div>
    </div>
    `;
}

function selectOccasion(l_occasion) {
    if (!cards) {
        console.error('Cards data not loaded');
        return;
    }

    occasion = l_occasion;
    switch (l_occasion) {
        case 1:
            occasionCards = cards.filter(card => card.occasion === 'رمضان');
            showCards(occasionCards);
            break;
        case 2:
            occasionCards = cards.filter(card => card.occasion === 'عيد الفطر');
            showCards(occasionCards);
            break;
        case 3:
            occasionCards = cards.filter(card => card.occasion === 'عيد الأضحى');
            showCards(occasionCards);
            break;
        default:
            break;
    }
}

function showCards(cards) {
    if (cards.length > 0) {
        document.getElementById('modal-body').innerHTML = '';
        document.getElementById('downloadButton').style.display = 'block';
    } else {
        document.getElementById('modal-body').innerHTML = `
            <h1>قريبا</h1>
        `;
    }

    cards.map((card, index) => {
        document.getElementById('modal-body').innerHTML += `
            <div id="${index}" class="card mb-3 mx-auto" data-img-link="${card.imgLink}" data-title="${card.title}" style="max-width: 100%; width: 300px;">
                <img src="${card.imgLink}" class="card-img-top" alt="..." style="width: 100%; height: auto; object-fit: cover;">
                <div class="card-body text-center">
                    <h5 class="card-title mb-3">${card.title}</h5>
                    <button class="btn btn-primary w-100" onclick="selectImage('${card.imgLink}', ${index})">اختر</button>
                </div>
            </div>
        `;
    });
}

function selectImage(imgLink, cardId) {
    selectedCard = occasionCards[cardId];
    
    // Reset the previously selected card
    if (selectedCardHtml) {
        selectedCardHtml.innerHTML = `
            <img src="${selectedCardHtml.dataset.imgLink}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">${selectedCardHtml.dataset.title}</h5>
                <button class="btn btn-primary" onclick="selectImage('${selectedCardHtml.dataset.imgLink}', '${selectedCardHtml.id}')">اختر</button>
            </div>
        `;
    }

    // Modify the selected card
    selectedCardHtml = document.getElementById(cardId);
    selectedCardHtml.innerHTML = `
        <img src="${imgLink}" class="card-img-top" alt="...">
        <div class="card-body">
            <h5 class="card-title">${selectedCardHtml.dataset.title}</h5>
            <button class="btn btn-success" onclick="selectImage('${imgLink}', '${cardId}')">تم الاختيار</button>
        </div>
    `;
}

function generateImage() {
    if (!occasion) {
        alert('الرجاء اختيار المناسبة');
        return;
    }

    if (!selectedCard) {
        alert('الرجاء اختيار البطاقة');
        return;
    }

    const name = document.getElementById('name').value;

    // Encode the name in Base64
    let encodedName = utf8_to_b64(name);

    // Make the Base64 string URL safe
    encodedName = encodedName.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    let parameters = {
        txt64: encodedName,
        'txt-size': selectedCard.txtSize,
        'txt-align': 'center',
        'txt-font': 'AlTarikh',
        'txt-fit': 'max'
    }

    if (selectedCard.y) {
        parameters['txt-y'] = selectedCard.y;
    }

    if (selectedCard.x) {
        parameters['txt-x'] = selectedCard.txtX;
    }

    if (selectedCard.txtColor) {
        parameters['txt-color'] = selectedCard.txtColor;
    }

    if (selectedCard.txtColor) {
        parameters['txt-color'] = selectedCard.txtColor;
    }
    console.log(parameters);
    // fetch the image then download it
    fetch(`${selectedCard.imgLink}?${new URLSearchParams(parameters)}`)
        .then(response => response.blob())
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${name}.jpg`;
            a.click();
        });
}

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

loadMetaData();