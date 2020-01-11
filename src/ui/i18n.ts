/**
 * @license
 * MIT License
 *
 * Copyright (c) 2020 Alexis Munsayac
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 *
 * @author Alexis Munsayac <alexis.munsayac@gmail.com>
 * @copyright Alexis Munsayac 2020
 */
// List of language codes: http://www.lingoes.net/en/translator/langcode.htm

interface Vocabulary {
  [key: string]: string;
}

interface TranslationMap {
  [key: string]: Vocabulary;
}

export const translations: TranslationMap = {
  'en-US': {
    Play: 'Play',
    Pause: 'Pause',
    Mute: 'Mute',
    Unmute: 'Unmute',
    Miniplayer: 'Miniplayer',
    Settings: 'Settings',
    'Full screen': 'Full screen',
    'Exit full screen': 'Exit full screen',
    Speed: 'Speed',
    'Normal speed': 'Normal',
    Subtitles: 'Subtitles',
    'No subtitles': 'None',
    Quality: 'Quality',
    'Automatic quality': 'Auto',
    'Enable subtitles': 'Enable subtitles',
    'Disable subtitles': 'Disable subtitles',
  },
  'nl-BE': {
    Play: 'Afspelen',
    Pause: 'Pauzeren',
    Mute: 'Dempen',
    Unmute: 'Unmute',
    Miniplayer: 'Mini speler',
    Settings: 'Instellingen',
    'Full screen': 'Volledig scherm',
    'Exit full screen': 'Volledig scherm afsluiten',
    Speed: 'Snelheid',
    'Normal speed': 'Normale snelheid',
    Subtitles: 'Ondertitels',
    'No subtitles': 'Geen',
    Quality: 'Kwaliteit',
    'Automatic quality': 'Automatisch',
    'Enable subtitles': 'Ondertitels aan',
    'Disable subtitles': 'Ondertitels uit',
  },
  'de-DE': {
    Play: 'Wiedergabe',
    Pause: 'Pause',
    Mute: 'Stummschalten',
    Unmute: 'Stummschaltung aufheben',
    Miniplayer: 'Miniplayer',
    Settings: 'Einstellungen',
    'Full screen': 'Vollbild',
    'Exit full screen': 'Vollbildmodus verlassen',
    Speed: 'Geschwindigkeit',
    'Normal speed': 'Normal',
    Subtitles: 'Untertitel',
    'No subtitles': 'Aus',
    Quality: 'Qualität',
    'Automatic quality': 'Automatisch',
    'Enable subtitles': 'Untertitel an',
    'Disable subtitles': 'Untertitel aus',
  },
  'hi-IN': {
    Play: 'चलाएँ',
    Pause: 'रोकें',
    Mute: 'ध्वनि बंद करें',
    Unmute: 'ध्वनि शुरू करें',
    Miniplayer: 'लघु संस्करण',
    Settings: 'नियंत्रण',
    'Full screen': 'पूर्ण संस्करण',
    'Exit full screen': 'पूर्ण संस्करण से बाहर निकलें',
    Speed: 'गति',
    'Normal speed': 'सामान्य',
    Subtitles: 'उपशीर्षक',
    'No subtitles': 'उपशीर्षक उपलब्ध नहीं है',
    Quality: 'गुणवत्ता',
    'Automatic quality': 'स्वचालित',
    'Enable subtitles': 'उपशीर्षक जारी रखें',
    'Disable subtitles': 'उपशीर्षक बंद करें',
  },
  'mr-IN': {
    Play: 'चालू करा',
    Pause: 'थांबवा',
    Mute: 'आवाज बंद करा ',
    Unmute: 'आवाज सुरू करा',
    Miniplayer: 'लघु आवृत्ती',
    Settings: 'नियंत्रणे',
    'Full screen': 'पूर्ण आवृत्ती',
    'Exit full screen': 'पूर्ण आवृत्तीतून बाहेर पडा',
    Speed: 'गति',
    'Normal speed': 'सामान्य',
    Subtitles: 'उपशीर्षके',
    'No subtitles': 'उपशीर्षके उपलब्ध नाहीत',
    Quality: 'गुणवत्ता',
    'Automatic quality': 'स्वयंचलित',
    'Enable subtitles': 'उपशीर्षके सूरू करा',
    'Disable subtitles': 'उपशीर्षके बंद करा',
  },
};

export const getTranslation = (languageCode: string) => (text: string): string => {
  if (translations[languageCode] && translations[languageCode][text]) {
    return translations[languageCode][text];
  }
  return text;
};
