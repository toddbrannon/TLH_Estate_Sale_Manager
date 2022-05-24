const form = document.getElementById('inputForm');
const cards = form.getElementsByClassName('card-body');
const submit = document.getElementById('saveBtn');

let isNew;
let saleId;
let currentCard;

const setupEditSale = (id, cardIndex, isAllValidated) => {
  submit.innerHTML = 'Save Changes';
  for (const card of cards) {
    card.classList.add('was-validated');
    card.style.display = isAllValidated || parseInt(card.id.replace('card-', '')) - 1 <= cardIndex ? 'block' : 'none'
  }
  isNew = false;
  saleId = id;

  currentCard = cardIndex;

  setupSaveButton();
  setupDeleteButton();
  document.getElementById("invoiceBtn").style.display = isAllValidated ? 'block' : 'none';
}

const setupNewSale = () => {
  for (let i = 1; i <= 3; i++) {
    cards[i].style.display = 'none';
  }
  isNew = true;
  currentCard = 0;
  setupSaveButton();
}

const isExtraValidedSaleResultsCard = form => {
  //(Gross Sales Credit/Debit + Gross Sales Cash) = Gross Sales Actual Clover
  const creditDebit = parseFloat(form.get('grossSalesCreditDebit'));
  const cash = parseFloat(form.get('grossSalesCash'));
  const actualClover = parseFloat(form.get('grossSalesActualClover'));
  return (creditDebit + cash).toFixed(2) === actualClover.toFixed(2)
}

const setupSaveButton = () => {
  submit.addEventListener('click', e => {
    e.preventDefault();

    

    document.getElementById("deleteErrorMessage").innerText = ''

    if (isNew) {
      cards[currentCard].classList.add('was-validated');
    }

    for (let i = 0; i <= currentCard; i++) {
      if (cards[i].querySelectorAll(':invalid').length) {
        alert('Invalid fields found.');
        return;
      }
    }

    const form = document.getElementById('inputForm');
    const formData = new FormData(form);

    //System check by card - sale {status} - 2=Sale Results
    if (currentCard > 2) {
      if (!isExtraValidedSaleResultsCard(formData)) {

        alert('Cannot save your changes: (Gross Sales Credit/Debit + Gross Sales Cash = Gross Sales Actual Clover) must be true. Check your values for these fields and try again.');
        
        return;
      } 
    }

    const data = new URLSearchParams(formData);

    let url = '/sale';
    if (saleId) {
      url += '/' + saleId;
    }
    fetch(url, {
      method: 'post',
      body: data,
    })
      .then(response => response.json())
      .then(data => {
        saleId = data.id;
        currentCard++;

        window.location.href = "/sales";
      })
      .catch((error) => {
        console.log('Error:', error);
      });
    return false;
  });
}

const setupDeleteButton = () => {
  const btn = document.getElementById("deleteBtn")
  btn.style.display = 'block';
  btn.addEventListener('click', e => {
    $('#deleteModal').modal('show')
  })

  document.getElementById("deleteModalCancel").addEventListener('click', e => {
    $('#deleteModal').modal('hide')
  })

  document.getElementById("deleteModalConfirm").addEventListener('click', e => {
    $('#deleteModal').modal('hide')

    if (!saleId) {
      return
    }
    fetch(`/${saleId}`, {
      method: 'delete'
    })
      .then(data => {
        if (data.status !== 200) {
          //error
          document.getElementById("deleteErrorMessage").innerText = data.statusText
        } else {
          window.location.href = "/sales";
        }
      })
      .catch((error) => {
        console.log('Error:', error);
      });
    return false;
  })

}

export { setupEditSale, setupNewSale }
