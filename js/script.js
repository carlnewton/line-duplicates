var displayRadios = document.querySelectorAll('input[type=radio][name=display]');
displayRadios.forEach(displayRadio => displayRadio.addEventListener('change', () => changeDisplay(event)));

var text, counts, nonDupes;

document.querySelector('#lines').oninput = function() {
    count();
}

document.querySelector('#ignore-empty').onclick = function() {
    if (text === undefined || text === '') return;
    var tempText = text;
    clear();
    text = tempText;
    document.querySelector('#lines').value = text;
    count();
}

document.querySelector('#remove-dupes').onclick = function() {
    var keep = document.querySelector('input[type=radio][name=keep]:checked').value;

    var uniqueLines = [];
    var lines = text.split('\n');
    if (keep === 'last') lines.reverse();

    for (let line of lines) {
        if (uniqueLines.indexOf(line) === -1 || (document.querySelector('#ignore-empty').checked && line === '')) {
            uniqueLines.push(line)
        }
    }

    if (keep === 'last') uniqueLines.reverse();

    var uniqueLinesText = '';
    for (let uniqueLine of uniqueLines) {
        uniqueLinesText += uniqueLine + '\n';
    }

    clear();
    document.querySelector('#total-lines').innerText = uniqueLines.length;
    document.querySelector('#lines').value = uniqueLinesText;
}

document.querySelector('#clear').onclick = function() {
    clear();
}

function count() {
    text = '';
    counts = [];
    nonDupes = [];

    document.querySelector('#display-all').checked = true;
    document.querySelector('#total-dupes').innerText = 0;
    document.querySelector('#total-lines').innerText = 0;
    document.querySelector('#display-duplicates').disabled = true;
    document.querySelector('#display-non-duplicates').disabled = true;
    document.querySelector('#keep-first').disabled = true;
    document.querySelector('#keep-last').disabled = true;
    document.querySelector('#remove-dupes').classList.add('disabled');
    document.querySelector('#clear').disabled = true;
    text = document.querySelector('#lines').value;

    if (!text) return;

    var lines = text.split('\n');
    document.querySelector('#total-lines').innerText = lines.length;
    document.querySelector('#clear').disabled = false;

    if (lines.length <= 1) return;

    var dupesFound = false;

    for (let line of lines) {
        let dupe = counts.find(count => count.line === line);
        if (dupe && (!document.querySelector('#ignore-empty').checked || line !== '')) {
            dupe.count++;
            dupesFound = true;
        } else {
            counts.push({
                line: line,
                count: 1
            });
        }
    }

    if (!dupesFound) return;

    document.querySelector('#display-duplicates').disabled = false;
    document.querySelector('#display-non-duplicates').disabled = false;
    document.querySelector('#keep-first').disabled = false;
    document.querySelector('#keep-last').disabled = false;
    document.querySelector('#remove-dupes').classList.remove('disabled');

    counts = counts.filter(function(count) {
        if (count.count === 1) nonDupes.push(count.line);
        return count.count !== 1;
    });

    var total = 0;
    for (let count of counts) {
        total += count.count;
    }

    document.querySelector('#total-dupes').innerText = total;
}

function clear() {
    text = '';
    counts = [];
    nonDupes = [];
    document.querySelector('#display-all').checked = true;
    document.querySelector('#total-dupes').innerText = 0;
    document.querySelector('#total-lines').innerText = 0;
    document.querySelector('#display-duplicates').disabled = true;
    document.querySelector('#display-non-duplicates').disabled = true;
    document.querySelector('#keep-first').disabled = true;
    document.querySelector('#keep-last').disabled = true;
    document.querySelector('#remove-dupes').classList.add('disabled');
    document.querySelector('#lines').value = '';
    document.querySelector('#clear').disabled = true;
}

function changeDisplay(event) {
    switch(event.target.value) {
        case 'all':
            document.querySelector('#lines').value = text;
            break;
        case 'duplicates':
            document.querySelector('#lines').value = getDupes();
            break;
        case 'non-duplicates':
            document.querySelector('#lines').value = getNonDupes();
            break;
    }
}

function getDupes() {
    var dupeText = '';
    for (let count of counts) {
        dupeText += count.line + '\n';
    }
    return dupeText;
}

function getNonDupes() {
    var nonDupeText = '';
    for (let nonDupe of nonDupes) {
        nonDupeText += nonDupe + '\n';
    }
    return nonDupeText;
}
