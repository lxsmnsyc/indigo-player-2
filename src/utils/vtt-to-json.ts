// removes everything but characters and apostrophe and dash
function cleanWord(word: string): string {
  return word.replace(/[^0-9a-z'-]/gi, '').toLowerCase();
}

const { parseInt } = Number;

// helpers
//   http://codereview.stackexchange.com/questions/45335/milliseconds-to-time-string-time-string-to-milliseconds
function timeString2ms(a: string): number {
  const splitA = a.split('.');

  const parsedRight = parseInt(splitA[1], 10);

  const timeSpan = splitA[0].split(':').map(parseInt);

  if (timeSpan[2]) {
    return parsedRight + (timeSpan[0] * 3600 + timeSpan[1] * 60 + timeSpan[2]) * 1e3;
  }

  if (timeSpan[1]) {
    return parsedRight + (timeSpan[0] * 60 + timeSpan[1]) * 1e3;
  }

  return parsedRight + timeSpan[0] * 1e3;
}

export interface Dialog {
  word: string;
  time?: number;
}

export interface Section {
  start: number;
  end: number;
  part: string;
  words?: Dialog[];
}

export default async function vttToJson(vttString: string): Promise<Section[]> {
  return new Promise((resolve) => {
    let current: Section;
    const sections: Section[] = [];
    let start = false;
    const vttArray = vttString.split('\n');
    vttArray.forEach((line, index) => {
      if (/^\s*[\r\n]/gm.test(line)) {
        if (current) {
          sections.push({ ...current });
        }
        start = false;
      } else if (line.includes('-->')) {
        start = true;

        current = {
          start: timeString2ms(
            line.split('-->')[0].trimRight().split(' ').pop() ?? '',
          ),
          end: timeString2ms(
            line.split('-->')[1].trimLeft().split(' ').shift() ?? '',
          ),
          part: '',
        };
      } else if (start) {
        if (current.part.length === 0) {
          current.part = line;
        } else {
          current.part = `${current.part} ${line}`;
        }
        // If it's the last line of the subtitles
        if (index === vttArray.length - 1) {
          sections.push({ ...current });
        }
      }
    });

    const regex = /(<([0-9:.>]+)>)/gi;
    sections.forEach((section) => {
      const strs = section.part.split('');
      const results = strs.map(
        (s) => s.replace(regex, (n) => (
          n.split('').reduce(
            () => `==${n.replace('<', '').replace('>', '')}`,
          )
        )),
      );
      const cleanText = results[0].replace(/<\/?[^>]+(>|$)/g, '');
      const cleanArray = cleanText.split(' ');
      const resultsArray: Dialog[] = [];
      cleanArray.forEach((item) => {
        if (item.includes('==')) {
          const [key] = item.split('==');
          if (key === '' || key === '##') {
            return;
          }
          resultsArray.push({
            word: cleanWord(item.split('==')[0]),
            time: timeString2ms(item.split('==')[1]),
          });
        } else {
          resultsArray.push({
            word: cleanWord(item),
          });
        }
      });
      const sect = section;
      sect.words = resultsArray;
      sect.part = section.part.replace(/<\/?[^>]+(>|$)/g, '');
    });
    resolve(sections);
  });
}
