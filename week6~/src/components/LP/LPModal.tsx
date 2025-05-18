import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp, updateLp } from '../../apis/lp';
import { LpDetail, Tag } from '../../types/lp';

interface InitialData {
  title: string;
  content: string;
  tags: Tag[];
}

interface LPModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'create' | 'edit';
  initialData?: InitialData;
  lpId?: number;
}

const LPModal = ({ isOpen, onClose, mode = 'create', initialData, lpId }: LPModalProps) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags?.map((tag) => tag.name) || []);
  const [newTag, setNewTag] = useState('');
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: mode === 'create' ? createLp : (data: FormData) => updateLp(lpId!, data),
    onMutate: async (formData) => {
      if (mode === 'edit' && lpId) {
        // 진행 중인 refetch들을 취소
        await queryClient.cancelQueries({ queryKey: ['lpDetail', lpId] });

        // 이전 데이터를 저장
        const previousLp = queryClient.getQueryData<LpDetail>(['lpDetail', lpId]);

        // 새로운 데이터로 UI 즉시 업데이트
        const title = formData.get('title')?.toString() || '';
        const content = formData.get('content')?.toString() || '';
        const newTags = JSON.parse(formData.get('tags')?.toString() || '[]');

        if (previousLp) {
          queryClient.setQueryData<LpDetail>(['lpDetail', lpId], {
            ...previousLp,
            data: {
              ...previousLp.data,
              title,
              content,
              tags: newTags.map((name: string, index: number) => ({
                id: previousLp.data.tags[index]?.id || Date.now() + index,
                name
              }))
            }
          });
        }

        return { previousLp };
      }
      return undefined;
    },
    onError: (error: Error, _variables, context) => {
      // 에러 발생 시 이전 데이터로 롤백
      if (mode === 'edit' && lpId && context?.previousLp) {
        queryClient.setQueryData(['lpDetail', lpId], context.previousLp);
      }
      console.error('Error:', error);
      setError(`LP ${mode === 'create' ? '생성' : '수정'} 중 오류가 발생했습니다.`);
    },
    onSuccess: () => {
      // 성공 시 캐시 무효화 및 refetch
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      if (mode === 'edit' && lpId) {
        queryClient.invalidateQueries({ 
          queryKey: ['lpDetail', lpId],
          exact: true 
        });
      }
      onClose();
    }
  });

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      if (tags.length >= 5) {
        setError('태그는 최대 5개까지만 추가할 수 있습니다.');
        return;
      }
      setTags([...tags, newTag.trim()]);
      setNewTag('');
      setError(null);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setError('제목과 내용을 입력해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('tags', JSON.stringify(tags));

    try {
      await mutation.mutateAsync(formData);
    } catch {
      // Error will be handled by onError callback
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div 
        className="bg-zinc-900 p-8 rounded-lg w-full max-w-lg relative mx-4"
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-white text-2xl hover:text-gray-300"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-white mb-4">
          {mode === 'create' ? 'LP 추가' : 'LP 수정'}
        </h2>

        {error && (
          <div className="text-red-500 text-sm mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="LP 제목"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <textarea
              placeholder="LP 내용"
              value={content}
              onChange={e => setContent(e.target.value)}
              required
              className="w-full p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-pink-500 min-h-[100px] resize-y"
            />
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              placeholder="태그 입력"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="flex-1 p-2 bg-zinc-800 text-white rounded border border-zinc-700 focus:outline-none focus:border-pink-500"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600"
            >
              추가
            </button>
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <div 
                  key={tag}
                  className="flex items-center gap-1 px-3 py-1 bg-zinc-800 rounded-full text-sm text-gray-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-gray-400 hover:text-red-500 ml-1"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-zinc-700 text-white rounded hover:bg-zinc-600 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className={`px-4 py-2 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors
                ${mutation.isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {mutation.isPending ? '처리 중...' : mode === 'create' ? '추가' : '수정'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LPModal; 