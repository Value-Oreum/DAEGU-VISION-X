/**
 * DAEGU VISION X — 문의 폼 백엔드 (Google Apps Script)
 * ---------------------------------------------------------------
 * 역할: 웹사이트 문의 폼(POST)을 받아
 *   1) 구글 시트에 한 줄씩 저장
 *   2) 지정한 3개 메일로 알림 발송
 *
 * 설정 방법은 README.md 의 "문의 폼 연결" 참고.
 * ---------------------------------------------------------------
 */

// 알림을 받을 메일 주소 (쉼표로 구분)
var NOTIFY_TO = 'unboundedvalue@gmail.com,echa.value@gmail.com,dkkim@dkglobalkorea.co.kr';

// 저장할 시트 이름 (없으면 자동 생성)
var SHEET_NAME = '문의';

function doPost(e) {
  try {
    var p = (e && e.parameter) ? e.parameter : {};

    // 스팸 봇 방지(허니팟): _hp 값이 있으면 무시
    if (p._hp) {
      return _json({ ok: true, skipped: true });
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
      sheet.appendRow(['접수시각', '성함/소속', '이메일', '연락처', '문의내용']);
    }

    var now = new Date();
    var name    = p.name    || '';
    var email   = p.email   || '';
    var phone   = p.phone   || '';
    var message = p.message || '';

    // 1) 시트에 저장
    sheet.appendRow([now, name, email, phone, message]);

    // 2) 메일 발송
    var subject = '[DAEGU VISION X] 새 문의 - ' + name;
    var body =
      '홈페이지를 통해 새 문의가 접수되었습니다.\n\n' +
      '■ 성함/소속: ' + name + '\n' +
      '■ 이메일: ' + email + '\n' +
      '■ 연락처: ' + phone + '\n' +
      '■ 문의 내용:\n' + message + '\n\n' +
      '■ 접수 시각: ' + Utilities.formatDate(now, 'Asia/Seoul', 'yyyy-MM-dd HH:mm:ss');

    MailApp.sendEmail({
      to: NOTIFY_TO,
      subject: subject,
      body: body,
      replyTo: email || undefined   // 회신 시 문의자에게 바로 답장
    });

    return _json({ ok: true });
  } catch (err) {
    return _json({ ok: false, error: String(err) });
  }
}

// 배포 확인용(브라우저로 URL 열면 표시)
function doGet() {
  return _json({ ok: true, service: 'DAEGU VISION X contact endpoint' });
}

function _json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
