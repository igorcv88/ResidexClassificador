import { useState, useCallback, useRef, useMemo } from 'react';

const MODEL = 'claude-sonnet-4-20250514';

const TOPICS = [
  { spec: 'PREV', name: 'Medidas de Saúde Coletiva', code: 'PREV1' },
  { spec: 'PREV', name: 'Estudos Epidemiológicos', code: 'PREV2' },
  { spec: 'PREV', name: 'Testes Epidemiológicos', code: 'PREV3' },
  { spec: 'PREV', name: 'Vigilância Epidemiológica', code: 'PREV4' },
  { spec: 'PREV', name: 'Saúde do Trabalhador', code: 'PREV5' },
  { spec: 'CM', name: 'Cardio — Arritmias Cardíacas e PCR', code: 'CM1a' },
  {
    spec: 'CM',
    name: 'Cardio — IC, Cardiomiopatias e Pericardiopatias',
    code: 'CM1b',
  },
  { spec: 'CM', name: 'Cardio — Hipertensão Arterial', code: 'CM1c' },
  {
    spec: 'CM',
    name: 'Cardio — Valvopatias e Semiologia Cardíaca',
    code: 'CM1d',
  },
  { spec: 'CM', name: 'Cardio — Doença Arterial Coronariana', code: 'CM1e' },
  {
    spec: 'CM',
    name: 'Cardio — Síndrome Metabólica e Dislipidemia',
    code: 'CM1f',
  },
  { spec: 'CM', name: 'Endocrino — Doenças da Tireoide', code: 'CM2a' },
  { spec: 'CM', name: 'Endocrino — Doenças da Paratireoide', code: 'CM2b' },
  {
    spec: 'CM',
    name: 'Endocrino — Suprarrenal, Hipófise e Hipotálamo',
    code: 'CM2c',
  },
  { spec: 'CM', name: 'Endocrino — Diabetes Mellitus', code: 'CM2d' },
  { spec: 'CM', name: 'Endocrino — Obesidade', code: 'CM2e' },
  {
    spec: 'CM',
    name: 'Gastro — Pancreatite e Neoplasias Pancreáticas',
    code: 'CM3a',
  },
  {
    spec: 'CM',
    name: 'Gastro — Diarreias, Disabsorção e Parasitoses',
    code: 'CM3b',
  },
  { spec: 'CM', name: 'Gastro — DIIs, SII e Constipação', code: 'CM3c' },
  {
    spec: 'CM',
    name: 'Hepato — Anatomia, Fisiologia e Hepatites',
    code: 'CM4a',
  },
  {
    spec: 'CM',
    name: 'Hepato — Insuficiência Hepática e suas Causas',
    code: 'CM4b',
  },
  {
    spec: 'CM',
    name: 'Hepato — Insuficiência Hepática e suas Complicações',
    code: 'CM4c',
  },
  { spec: 'CM', name: 'Hepato — Tumores Hepáticos', code: 'CM4d' },
  {
    spec: 'CM',
    name: 'Infecto — Síndromes Bacterianas, ITU e Antibioticoterapia',
    code: 'CM6a',
  },
  { spec: 'CM', name: 'Infecto — Síndromes Febris', code: 'CM6b' },
  { spec: 'CM', name: 'Infecto — Toxicologia', code: 'CM6c' },
  { spec: 'CM', name: 'Infecto — HIV/AIDS', code: 'CM6d' },
  {
    spec: 'CG',
    name: 'Trauma — Atendimento Inicial ao Politraumatizado',
    code: 'CG1a',
  },
  { spec: 'CG', name: 'Trauma — Trauma Torácico', code: 'CG1b' },
  {
    spec: 'CG',
    name: 'Trauma — Trauma Abdominal, Pélvico e Urológico',
    code: 'CG1c',
  },
  {
    spec: 'CG',
    name: 'Trauma — Neurotrauma e Trauma Crânio-Cervical',
    code: 'CG1d',
  },
  {
    spec: 'CG',
    name: 'Trauma — Queimaduras e Trauma de Extremidades',
    code: 'CG1e',
  },
  { spec: 'CG', name: 'Gastrocirúrgica — Doenças do Esôfago', code: 'CG2a' },
  { spec: 'CG', name: 'Gastrocirúrgica — Doenças do Estômago', code: 'CG2b' },
  {
    spec: 'CG',
    name: 'Gastrocirúrgica — Doenças das Vias Biliares',
    code: 'CG2c',
  },
  {
    spec: 'CG',
    name: 'Gastrocirúrgica — Doenças Malignas das Vias Biliares',
    code: 'CG2d',
  },
  { spec: 'CG', name: 'Gastrocirúrgica — Cirurgia de Obesidade', code: 'CG2e' },
  { spec: 'CG', name: 'Gastrocirúrgica — Hemorragia Digestiva', code: 'CG2f' },
  { spec: 'CG', name: 'Hérnias', code: 'CG3' },
  { spec: 'CG', name: 'Abdome Agudo — Inflamatório', code: 'CG4a' },
  {
    spec: 'CG',
    name: 'Abdome Agudo — Obstrutivo, Vascular e Perfurativo',
    code: 'CG4b',
  },
  {
    spec: 'CG',
    name: 'Perioperatório — Técnica Cirúrgica e Pós-Operatório',
    code: 'CG5a',
  },
  {
    spec: 'CG',
    name: 'Perioperatório — Pré-Operatório e Nutrição Cirúrgica',
    code: 'CG5b',
  },
  { spec: 'CG', name: 'Ortopedia — Geral e Fraturas', code: 'CG9a' },
  { spec: 'CG', name: 'Ortopedia — Pediátrica e Tumores Ósseos', code: 'CG9b' },
  { spec: 'CG', name: 'Anestesiologia', code: 'CG11' },
  { spec: 'CG', name: 'Oftalmologia', code: 'CG13' },
  {
    spec: 'PED',
    name: 'Neonato — Reanimação e Triagem Neonatal',
    code: 'PED1a',
  },
  {
    spec: 'PED',
    name: 'Neonato — Distúrbios I (Sepse, Icterícia, Resp.)',
    code: 'PED1b',
  },
  {
    spec: 'PED',
    name: 'Neonato — Distúrbios II (Infecções Cong. e Metab.)',
    code: 'PED1c',
  },
  { spec: 'PED', name: 'Neonato — Distúrbios III (Miscelânea)', code: 'PED1d' },
  { spec: 'PED', name: 'Alimentação Infantil', code: 'PED2' },
  { spec: 'PED', name: 'Síndromes Pondero-Estaturais', code: 'PED3a' },
  { spec: 'PED', name: 'Síndromes Puberais', code: 'PED3b' },
  { spec: 'PED', name: 'Distúrbios Nutricionais', code: 'PED4' },
  { spec: 'PED', name: 'Uropediatria', code: 'PED6' },
  { spec: 'PED', name: 'Doenças Exantemáticas', code: 'PED8' },
  { spec: 'GO', name: 'Gin — Ciclo Menstrual', code: 'GIN1' },
  { spec: 'GO', name: 'Gin — Planejamento Familiar', code: 'GIN2' },
  { spec: 'GO', name: 'Gin — Amenorreia', code: 'GIN3' },
  { spec: 'GO', name: 'Gin — Síndrome dos Ovários Policísticos', code: 'GIN4' },
  { spec: 'GO', name: 'Gin — SUA e Dismenorreia', code: 'GIN5' },
  {
    spec: 'GO',
    name: 'Gin — IST I: Vulvovaginites, Cervicites e DIP',
    code: 'GIN6a',
  },
  {
    spec: 'GO',
    name: 'Gin — IST II: Úlceras Genitais e Violência Sexual',
    code: 'GIN6b',
  },
  { spec: 'GO', name: 'Obs — Avaliação Inicial da Gestação', code: 'OBS1' },
  { spec: 'GO', name: 'Obs — Assistência ao Pré-Natal', code: 'OBS2' },
  { spec: 'GO', name: 'Obs — Sangramentos Gestacionais', code: 'OBS3' },
  { spec: 'GO', name: 'Obs — DHG e DMG', code: 'OBS4a' },
  { spec: 'GO', name: 'Obs — STORCHs, Gemelaridade e Outras', code: 'OBS4b' },
];

const TOPIC_BY_CODE = Object.fromEntries(TOPICS.map((t) => [t.code, t]));

const SPEC_META = {
  PREV: { label: 'Preventiva', color: '#60a5fa' },
  CM: { label: 'Clínica Médica', color: '#f87171' },
  CG: { label: 'Cirurgia Geral', color: '#fb923c' },
  PED: { label: 'Pediatria', color: '#4ade80' },
  GO: { label: 'Gineco/Obstet', color: '#f472b6' },
};

const TOPIC_LIST = TOPICS.map((t) => `${t.code}=${t.name}`).join(' | ');

const SYSTEM_PROMPT = `Você é um classificador especializado em questões de provas de residência médica brasileira (R1).

Analise o PDF e classifique CADA questão usando EXCLUSIVAMENTE os códigos da lista abaixo.

RETORNE APENAS um objeto JSON válido. Sem texto antes ou depois, sem markdown, sem comentários.

Formato:
{"inst":"NOME","year":ANO,"n":TOTAL,"questoes":[{"q":NUM,"primary":"CODE","secondary":"SUBTEMA_OU_NULL"}]}

Regras:
- "primary": use EXATAMENTE um dos códigos abaixo — o que melhor representa o tema central da questão
- "secondary": subtema específico em texto livre curto (ex: "Diagnóstico diferencial", "Conduta terapêutica"), ou null
- Se a questão não se encaixar em nenhum código, use o mais próximo e descreva em "secondary"

Códigos disponíveis:
${TOPIC_LIST}`;

function readFileAsBase64(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(',')[1]);
    r.onerror = () => reject(new Error('Falha ao ler arquivo'));
    r.readAsDataURL(file);
  });
}
function readFileAsCleanText(file) {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      // Cria um DOM virtual no navegador para limpar as tags HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(r.result, 'text/html');
      // doc.body.innerText pega apenas o texto puro da prova
      resolve(doc.body.innerText || doc.body.textContent);
    };
    r.onerror = () => reject(new Error('Falha ao ler arquivo HTML'));
    r.readAsText(file);
  });
}
function parseResponse(content) {
  const text = content
    .map((b) => (b.type === 'text' ? b.text : ''))
    .join('')
    .replace(/```json|```/g, '')
    .trim();
  return JSON.parse(text);
}

function exportCSV(results) {
  const rows = [['inst', 'year', 'q', 'spec', 'code', 'topic', 'secondary']];
  results.forEach((exam) => {
    (exam.questoes || []).forEach((q) => {
      const t = TOPIC_BY_CODE[q.primary] || { spec: '?', name: q.primary };
      rows.push([
        exam.inst,
        exam.year,
        q.q,
        t.spec,
        q.primary,
        t.name,
        q.secondary ?? '',
      ]);
    });
  });
  const csv = rows
    .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n');
  Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })),
    download: 'residex_classificacao.csv',
  }).click();
}

function exportJSON(results) {
  Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(
      new Blob([JSON.stringify(results, null, 2)], {
        type: 'application/json',
      })
    ),
    download: 'residex_classificacao.json',
  }).click();
}

function SpecBadge({ spec }) {
  const m = SPEC_META[spec] || { label: spec, color: '#64748b' };
  return (
    <span
      style={{
        background: m.color + '18',
        color: m.color,
        border: `1px solid ${m.color}40`,
        padding: '1px 7px',
        borderRadius: '3px',
        fontSize: '11px',
        fontWeight: '700',
        fontFamily: 'monospace',
        letterSpacing: '0.4px',
        whiteSpace: 'nowrap',
      }}
    >
      {spec}
    </span>
  );
}

function CodeTag({ code }) {
  const t = TOPIC_BY_CODE[code];
  const color = t ? SPEC_META[t.spec]?.color || '#64748b' : '#475569';
  return (
    <span
      style={{
        color,
        fontFamily: 'monospace',
        fontSize: '12px',
        fontWeight: '600',
      }}
    >
      {code}
    </span>
  );
}

function StatBar({ label, count, total, color }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div style={{ marginBottom: '6px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '12px',
          marginBottom: '3px',
        }}
      >
        <span
          style={{
            color: '#94a3b8',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '70%',
          }}
        >
          {label}
        </span>
        <span
          style={{ color: '#e2e8f0', fontFamily: 'monospace', flexShrink: 0 }}
        >
          {count} <span style={{ color: '#334155' }}>({pct.toFixed(1)}%)</span>
        </span>
      </div>
      <div
        style={{ height: '3px', background: '#1e293b', borderRadius: '2px' }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            borderRadius: '2px',
            transition: 'width 0.6s ease',
          }}
        />
      </div>
    </div>
  );
}

function ExamPanel({ exam }) {
  const [search, setSearch] = useState('');
  const [specFilter, setSpecFilter] = useState('ALL');
  const questoes = exam.questoes || [];

  const specStats = useMemo(() => {
    const m = {};
    questoes.forEach((q) => {
      const s = TOPIC_BY_CODE[q.primary]?.spec ?? '?';
      m[s] = (m[s] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [questoes]);

  const topicStats = useMemo(() => {
    const m = {};
    questoes.forEach((q) => {
      m[q.primary] = (m[q.primary] || 0) + 1;
    });
    return Object.entries(m).sort((a, b) => b[1] - a[1]);
  }, [questoes]);

  const specs = useMemo(
    () => ['ALL', ...specStats.map(([s]) => s)],
    [specStats]
  );

  const filtered = useMemo(
    () =>
      questoes.filter((q) => {
        const spec = TOPIC_BY_CODE[q.primary]?.spec ?? '?';
        if (specFilter !== 'ALL' && spec !== specFilter) return false;
        const s = search.toLowerCase();
        return (
          !s ||
          (q.primary || '').toLowerCase().includes(s) ||
          (TOPIC_BY_CODE[q.primary]?.name || '').toLowerCase().includes(s) ||
          (q.secondary || '').toLowerCase().includes(s) ||
          String(q.q).includes(s)
        );
      }),
    [questoes, specFilter, search]
  );

  const inp = {
    background: '#0f172a',
    border: '1px solid #1e293b',
    color: '#e2e8f0',
    borderRadius: '6px',
    padding: '7px 12px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            background: '#0a0e1a',
            border: '1px solid #1e293b',
            borderRadius: '10px',
            padding: '16px',
          }}
        >
          <div
            style={{
              fontSize: '10px',
              color: '#334155',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              marginBottom: '14px',
            }}
          >
            Por Especialidade
          </div>
          {specStats.map(([spec, n]) => (
            <StatBar
              key={spec}
              label={SPEC_META[spec]?.label || spec}
              count={n}
              total={exam.n}
              color={SPEC_META[spec]?.color || '#64748b'}
            />
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
            }}
          >
            {[
              { v: exam.n, l: 'Total Questões' },
              { v: specStats.length, l: 'Especialidades' },
              {
                v: new Set(questoes.map((q) => q.primary)).size,
                l: 'Temas Únicos',
              },
              {
                v: questoes.filter((q) => q.secondary).length,
                l: 'Com Subtema',
              },
            ].map((item) => (
              <div
                key={item.l}
                style={{
                  background: '#0a0e1a',
                  border: '1px solid #1e293b',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <div
                  style={{
                    fontSize: '26px',
                    fontWeight: '700',
                    color: '#f1f5f9',
                    fontFamily: 'monospace',
                    lineHeight: 1,
                  }}
                >
                  {item.v}
                </div>
                <div
                  style={{
                    fontSize: '11px',
                    color: '#475569',
                    marginTop: '4px',
                  }}
                >
                  {item.l}
                </div>
              </div>
            ))}
          </div>
          <div
            style={{
              background: '#0a0e1a',
              border: '1px solid #1e293b',
              borderRadius: '8px',
              padding: '14px',
              flex: 1,
            }}
          >
            <div
              style={{
                fontSize: '10px',
                color: '#334155',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                marginBottom: '10px',
              }}
            >
              Top Temas — clique para filtrar
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {topicStats.slice(0, 10).map(([code, n]) => {
                const t = TOPIC_BY_CODE[code];
                const color = t
                  ? SPEC_META[t.spec]?.color || '#64748b'
                  : '#475569';
                return (
                  <span
                    key={code}
                    onClick={() => setSearch(code.toLowerCase())}
                    style={{
                      background: '#1e293b',
                      color,
                      border: `1px solid ${color}30`,
                      padding: '3px 10px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      cursor: 'pointer',
                    }}
                  >
                    {code} <span style={{ color: '#38bdf8' }}>×{n}</span>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '12px',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div style={{ flex: 1, minWidth: '180px' }}>
          <input
            style={inp}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="🔍  Buscar código, tema, subtema ou nº…"
          />
        </div>
        <select
          value={specFilter}
          onChange={(e) => setSpecFilter(e.target.value)}
          style={{ ...inp, width: 'auto', cursor: 'pointer' }}
        >
          {specs.map((s) => (
            <option key={s} value={s}>
              {s === 'ALL' ? 'Todas especialidades' : SPEC_META[s]?.label || s}
            </option>
          ))}
        </select>
        <span
          style={{ fontSize: '12px', color: '#334155', whiteSpace: 'nowrap' }}
        >
          {filtered.length} questões
        </span>
        {search && (
          <button
            onClick={() => setSearch('')}
            style={{
              background: 'transparent',
              border: '1px solid #334155',
              color: '#64748b',
              padding: '5px 10px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            ✕
          </button>
        )}
      </div>

      <div
        style={{
          overflowX: 'auto',
          border: '1px solid #1e293b',
          borderRadius: '10px',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '13px',
          }}
        >
          <thead>
            <tr
              style={{
                background: '#0a0e1a',
                borderBottom: '2px solid #1e293b',
              }}
            >
              {[
                ['#', '40px'],
                ['Esp', '60px'],
                ['Código', '80px'],
                ['Tema', ''],
                ['Subtema', '200px'],
              ].map(([h, w]) => (
                <th
                  key={h}
                  style={{
                    padding: '10px 14px',
                    textAlign: 'left',
                    fontSize: '10px',
                    fontWeight: '600',
                    color: '#334155',
                    letterSpacing: '1px',
                    textTransform: 'uppercase',
                    width: w,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((q, i) => {
              const topic = TOPIC_BY_CODE[q.primary];
              const spec = topic?.spec ?? '?';
              return (
                <tr
                  key={q.q}
                  style={{
                    background: i % 2 === 0 ? '#070c18' : '#0a0e1a',
                    borderBottom: '1px solid #0f172a',
                    transition: 'background 0.1s',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = '#1e293b')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background =
                      i % 2 === 0 ? '#070c18' : '#0a0e1a')
                  }
                >
                  <td
                    style={{
                      padding: '9px 14px',
                      color: '#334155',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                    }}
                  >
                    {q.q}
                  </td>
                  <td style={{ padding: '9px 14px' }}>
                    <SpecBadge spec={spec} />
                  </td>
                  <td style={{ padding: '9px 14px' }}>
                    <CodeTag code={q.primary} />
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      color: '#94a3b8',
                      fontSize: '12px',
                    }}
                  >
                    {topic?.name ?? (
                      <span style={{ color: '#334155', fontStyle: 'italic' }}>
                        {q.primary}
                      </span>
                    )}
                  </td>
                  <td
                    style={{
                      padding: '9px 14px',
                      color: '#475569',
                      fontSize: '12px',
                      fontStyle: q.secondary ? 'normal' : 'italic',
                    }}
                  >
                    {q.secondary || '—'}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#334155',
                    fontSize: '13px',
                  }}
                >
                  Nenhuma questão encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ResidexClassifier() {
  const [queue, setQueue] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);
  const processing = useRef(false);

  const updateFile = useCallback((id, patch) => {
    setQueue((q) => q.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const processFile = useCallback(
    async (item) => {
      updateFile(item.id, { status: 'processing', pct: 10 });
      try {
        let messageContent;

        // Se for HTML, extrai o texto limpo
        if (
          item.file.name.endsWith('.html') ||
          item.file.type === 'text/html'
        ) {
          const textContent = await readFileAsCleanText(item.file);
          updateFile(item.id, { pct: 30 });
          messageContent = [
            { type: 'text', text: `CONTEÚDO DA PROVA:\n\n${textContent}` },
            {
              type: 'text',
              text: 'Classifique todas as questões desta prova de residência médica R1.',
            },
          ];
        } else {
          // Se for PDF, mantém a lógica antiga do Base64
          const b64 = await readFileAsBase64(item.file);
          updateFile(item.id, { pct: 30 });
          messageContent = [
            {
              type: 'document',
              source: {
                type: 'base64',
                media_type: 'application/pdf',
                data: b64,
              },
            },
            {
              type: 'text',
              text: 'Classifique todas as questões desta prova de residência médica R1.',
            },
          ];
        }

        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key':
              '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', // Sua API Key da Anthropic
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: [{ role: 'user', content: messageContent }],
          }),
        });
        updateFile(item.id, { pct: 85 });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        const parsed = parseResponse(data.content);
        updateFile(item.id, { status: 'done', result: parsed, pct: 100 });
        setActiveTab((prev) => prev ?? item.id);
      } catch (err) {
        updateFile(item.id, { status: 'error', error: err.message });
      }
    },
    [updateFile]
  );

  const runQueue = useCallback(
    async (items) => {
      if (processing.current) return;
      processing.current = true;
      for (const item of items) await processFile(item);
      processing.current = false;
    },
    [processFile]
  );

  const addFiles = useCallback(
    (fileList) => {
      // Agora aceita tanto PDF quanto HTML
      const items = Array.from(fileList)
        .filter(
          (f) =>
            f.type === 'application/pdf' ||
            f.type === 'text/html' ||
            f.name.endsWith('.html')
        )
        .map((f) => ({
          id: crypto.randomUUID(),
          name: f.name,
          file: f,
          status: 'waiting',
          result: null,
          error: null,
          pct: 0,
        }));
      if (!items.length) return;
      setQueue((q) => [...q, ...items]);
      setTimeout(() => runQueue(items), 0);
    },
    [runQueue]
  );

  const results = useMemo(
    () => queue.filter((f) => f.status === 'done').map((f) => f.result),
    [queue]
  );
  const doneQueue = queue.filter((f) => f.status === 'done');
  const activeResult = useMemo(() => {
    const f = queue.find((f) => f.id === activeTab && f.status === 'done');
    return f?.result ?? null;
  }, [queue, activeTab]);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        select option{background:#0f172a;}
        .dz:hover{border-color:#38bdf8!important;background:#0d1c30!important;}
        .xbtn:hover{background:#1e293b!important;}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes fadein{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
      `}</style>
      <div
        style={{
          fontFamily: "'DM Sans',system-ui,sans-serif",
          background: '#070c18',
          minHeight: '100vh',
          color: '#e2e8f0',
          padding: '28px 20px',
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        <div style={{ marginBottom: '28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '4px',
            }}
          >
            <span
              style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#38bdf8',
                letterSpacing: '3px',
              }}
            >
              RESIDEX //
            </span>
            <h1
              style={{ fontSize: '20px', fontWeight: '600', color: '#f1f5f9' }}
            >
              Classificador de Provas
            </h1>
          </div>
          <p style={{ fontSize: '13px', color: '#334155' }}>
            PDFs de provas R1 → classificação automática em {TOPICS.length}{' '}
            temas por especialidade
          </p>
        </div>

        <div
          className="dz"
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            addFiles(e.dataTransfer.files);
          }}
          onClick={() => inputRef.current?.click()}
          style={{
            border: `2px dashed ${dragging ? '#38bdf8' : '#1e293b'}`,
            background: dragging ? '#0d1c30' : '#0a0e1a',
            borderRadius: '12px',
            padding: '36px 20px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s',
            marginBottom: '20px',
          }}
        >
          {/* Adicionado o .html aqui no accept */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf, .html"
            multiple
            style={{ display: 'none' }}
            onChange={(e) => addFiles(e.target.files)}
          />
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>⊕</div>
          <div
            style={{ color: '#94a3b8', fontSize: '14px', marginBottom: '3px' }}
          >
            Arraste{' '}
            <span style={{ color: '#38bdf8', fontWeight: 'bold' }}>HTMLs</span>{' '}
            ou PDFs aqui ou{' '}
            <span style={{ color: '#38bdf8' }}>clique para selecionar</span>
          </div>
          <div style={{ color: '#1e293b', fontSize: '12px' }}>
            Múltiplos arquivos — processados sequencialmente
          </div>
        </div>

        {queue.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
              marginBottom: '24px',
            }}
          >
            {queue.map((f) => (
              <div
                key={f.id}
                style={{
                  background: '#0a0e1a',
                  border: `1px solid ${
                    f.status === 'done'
                      ? '#14532d'
                      : f.status === 'error'
                      ? '#450a0a'
                      : '#1e293b'
                  }`,
                  borderRadius: '8px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  animation: 'fadein 0.2s ease',
                }}
              >
                {f.status === 'processing' ? (
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      border: '2px solid #1e293b',
                      borderTop: '2px solid #38bdf8',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <span style={{ fontSize: '16px' }}>
                    {f.status === 'done'
                      ? '✅'
                      : f.status === 'error'
                      ? '❌'
                      : '⏳'}
                  </span>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: '12px',
                      color: '#94a3b8',
                      fontFamily: 'monospace',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {f.name}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      marginTop: '2px',
                      color:
                        f.status === 'done'
                          ? '#4ade80'
                          : f.status === 'error'
                          ? '#f87171'
                          : f.status === 'processing'
                          ? '#38bdf8'
                          : '#334155',
                    }}
                  >
                    {f.status === 'done'
                      ? `${f.result?.n} questões · ${f.result?.inst} ${f.result?.year}`
                      : f.status === 'error'
                      ? f.error
                      : f.status === 'processing'
                      ? 'Analisando prova…'
                      : 'Na fila'}
                  </div>
                </div>
                {f.status === 'processing' && (
                  <div
                    style={{
                      fontSize: '11px',
                      color: '#38bdf8',
                      fontFamily: 'monospace',
                      flexShrink: 0,
                    }}
                  >
                    {f.pct}%
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {results.length > 0 && (
          <div style={{ animation: 'fadein 0.3s ease' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #1e293b',
                marginBottom: '24px',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap' }}>
                {doneQueue.map((f) => (
                  <button
                    key={f.id}
                    className="xbtn"
                    onClick={() => setActiveTab(f.id)}
                    style={{
                      background:
                        activeTab === f.id ? '#1e293b' : 'transparent',
                      border: 'none',
                      color: activeTab === f.id ? '#f1f5f9' : '#475569',
                      padding: '8px 14px',
                      cursor: 'pointer',
                      borderRadius: '6px 6px 0 0',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      transition: 'all 0.15s',
                      borderBottom:
                        activeTab === f.id
                          ? '2px solid #38bdf8'
                          : '2px solid transparent',
                    }}
                  >
                    {f.result?.inst} {f.result?.year}
                  </button>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  ['↓ CSV', () => exportCSV(results)],
                  ['↓ JSON', () => exportJSON(results)],
                ].map(([l, fn]) => (
                  <button
                    key={l}
                    className="xbtn"
                    onClick={fn}
                    style={{
                      background: '#0a0e1a',
                      border: '1px solid #1e293b',
                      color: '#64748b',
                      padding: '6px 14px',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontFamily: 'monospace',
                      transition: 'background 0.15s',
                    }}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>
            {activeResult && <ExamPanel exam={activeResult} />}
          </div>
        )}

        {queue.length === 0 && (
          <div
            style={{ textAlign: 'center', padding: '80px 0', color: '#1e293b' }}
          >
            <div
              style={{ fontSize: '40px', marginBottom: '10px', opacity: 0.4 }}
            >
              ⊕
            </div>
            <div style={{ fontSize: '13px' }}>Nenhuma prova carregada</div>
          </div>
        )}
      </div>
    </>
  );
}
