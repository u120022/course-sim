const [getActiveUnit, setHint, diagnostics] = arguments;

{
  const macro = (from, to, minUnit, hint) => {
    const range = [...Array(to - from + 1)].map((_, i) => from + i);
    if (range.map((key) => getActiveUnit(key)).reduce((p, x) => p + x) < minUnit) {
      range.map((key) => setHint(key, hint));
    }
  };

  // 卒業要件をもとにしたルール
  {
    const tag = "卒業条件";
    macro(1, 2, 2, { tag, message: "総合科目 人間から 2単位必要です。" });
    macro(3, 13, 6, { tag, message: "総合科目 社会・環境から 6単位必要です。" });
    macro(14, 22, 4, { tag, message: "総合科目 言語・文化から 4単位必要です。" });
    macro(23, 30, 3, { tag, message: "総合科目 精神・身体から 3単位必要です。" });
    macro(1, 30, 19, { tag, message: "総合科目から 19単位必要です。" });
    macro(31, 41, 13, { tag, message: "基礎科目から 13単位必要です。" });
    macro(42, 53, 10, { tag, message: "外国語科目 英語から 10単位必要です。" });
    macro(54, 57, 2, { tag, message: "外国語科目 第2外国語から 2単位必要です。" });
    macro(58, 67, 7, { tag, message: "キャリア形成科目から 7単位必要です。" });
    macro(68, 114, 79, { tag, message: "専門科目から 79単位必要です。" });
		diagnostics.tagArray.push(tag);
  }

  // 卒業研究2履修条件をもとにしたルール
  {
    const tag = "卒業研究2履修条件";
    macro(1, 2, 2, { tag, message: "卒業研究2の履修に 総合科目 人間から 2単位必要です。" });
    macro(3, 13, 6, { tag, message: "卒業研究2の履修に 総合科目 社会・環境から 6単位必要です。" });
    macro(14, 22, 4, { tag, message: "卒業研究2の履修に 総合科目 言語・文化から 4単位必要です。" });
    macro(23, 30, 3, { tag, message: "卒業研究2の履修に 総合科目 精神・身体から 3単位必要です。" });
    macro(1, 30, 15, { tag, message: "卒業研究2の履修に 卒業研究2履修に 総合科目から 15単位必要です。" });
    macro(31, 41, 13, { tag, message: "卒業研究2の履修に 基礎科目から 13単位必要です。" });
    macro(42, 53, 6, { tag, message: "卒業研究2の履修に 外国語科目 英語から 6単位必要です。" });
    macro(54, 57, 2, { tag, message: "卒業研究2の履修に 外国語科目 第2外国語から 2単位必要です。" });
    macro(58, 67, 3, { tag, message: "卒業研究2の履修に キャリア形成科目から 3単位必要です。" });
    macro(68, 114, 69, { tag, message: "卒業研究2の履修に 専門科目 から69単位必要です。" });
		diagnostics.tagArray.push(tag);
  }

  // 指定科目履修条件をもとにしたルール
  {
    const tag = "プレゼンテーション1と卒業研究1履修条件";
    macro(1, 114, 70, { tag, message: "プレゼンテーション演習と卒業研究1の履修に すべての科目 から70単位必要です。" });
		diagnostics.tagArray.push(tag);
  }

  // 備考をもとにしたルール
  {
    const tag = "備考";
    macro(3, 13, 2, { tag, message: "経済学I-環境論II から2単位必要です。" });
    macro(15, 22, 2, { tag, message: "コミュニケーション論-国際関係論 から2単位必要です。" });
    macro(24, 30, 2, { tag, message: "心理学I-健康科学II から2単位必要です。" });
    macro(35, 37, 2, { tag, message: "化学I-生物学 から2単位必要です。" });
    macro(39, 40, 1, { tag, message: "数学物理学演習II-化学実験 から1単位必要です。" });
    macro(42, 45, 4, { tag, message: "英語基礎1-英語基礎4 から4単位必要です。" });
    macro(46, 53, 6, { tag, message: "総合英語1-英語特別演習4 から6単位必要です。" });
    macro(54, 57, 2, { tag, message: "ドイツ語I-中国語II から2単位必要です。" });
    macro(68, 75, 10, { tag, message: "卒業研究履修に 線形代数1-フーリエ解析学 から10単位必要です。" });
    macro(80, 82, 4, { tag, message: "卒業研究2の履修に アルゴリズムとデータ構造-ディジタル信号処理 から4単位必要です。" });
    macro(83, 85, 4, { tag, message: "卒業研究2の履修に 電気信号-論理回路基礎 から4単位必要です。" });
    macro(91, 95, 5, { tag, message: "プログラミング2-IoTプログラミング から5単位必要です。" });
    macro(96, 100, 6, { tag, message: "コンピュータアーキテクチャ-プログラミング言語 から6単位必要です。" });
    macro(101, 104, 4, { tag, message: "コンピュータネットワーク-待ち行列理論と性能評価 から4単位必要です。" });
    macro(105, 107, 2, { tag, message: "データベースとデータ処理-オペレーティングシステム から2単位必要です。" });
    macro(108, 110, 2, { tag, message: "画像処理基礎-生体情報工学 から2単位必要です。" });
    macro(111, 114, 4, { tag, message: "機械学習-情報システムと地球環境 から4単位必要です。" });
		diagnostics.tagArray.push(tag);
  }
}

{
  const macro = (key, hint) => {
    if (getActiveUnit(key) == 0) setHint(key, hint);
  };

  // 必修科目
  {
    const tag = "必修科目";

    macro(1, { tag, message: "必須科目です。" });
    macro(2, { tag, message: "必須科目です。" });
    macro(12, { tag, message: "必須科目です。" });
    macro(13, { tag, message: "必須科目です。" });
    macro(14, { tag, message: "必須科目です。" });
    macro(23, { tag, message: "必須科目です。" });

    macro(23, { tag, message: "必須科目です。" });
    macro(31, { tag, message: "必須科目です。" });
    macro(32, { tag, message: "必須科目です。" });
    macro(33, { tag, message: "必須科目です。" });
    macro(34, { tag, message: "必須科目です。" });
    macro(38, { tag, message: "必須科目です。" });
    macro(41, { tag, message: "必須科目です。" });

    macro(42, { tag, message: "必須科目です。" });
    macro(43, { tag, message: "必須科目です。" });
    macro(44, { tag, message: "必須科目です。" });
    macro(45, { tag, message: "必須科目です。" });

    macro(58, { tag, message: "必須科目です。" });
    macro(59, { tag, message: "必須科目です。" });
    macro(60, { tag, message: "必須科目です。" });
    macro(61, { tag, message: "必須科目です。" });
    macro(62, { tag, message: "必須科目です。" });

    macro(76, { tag, message: "必須科目です。" });
    macro(77, { tag, message: "必須科目です。" });
    macro(78, { tag, message: "必須科目です。" });
    macro(79, { tag, message: "必須科目です。" });
    macro(87, { tag, message: "必須科目です。" });
    macro(88, { tag, message: "必須科目です。" });
    macro(89, { tag, message: "必須科目です。" });
    macro(90, { tag, message: "必須科目です。" });
		diagnostics.tagArray.push(tag);
  }

  {
    const tag = "卒業研究2履修条件";
    macro(61, { tag, message: "卒業研究2の履修に必要です。" });
    macro(77, { tag, message: "卒業研究2の履修に必要です。" });
    macro(78, { tag, message: "卒業研究2の履修に必要です。" });
    macro(79, { tag, message: "卒業研究2の履修に必要です。" });
    macro(87, { tag, message: "卒業研究2の履修に必要です。" });
    macro(88, { tag, message: "卒業研究2の履修に必要です。" });
    macro(89, { tag, message: "卒業研究2の履修に必要です。" });
		// diagnostics.tagArray.push(tag);
  }
}
