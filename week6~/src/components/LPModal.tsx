/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled';
import { useState, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createLp } from '../apis/lp';

interface LPModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LPModal = ({ isOpen, onClose }: LPModalProps) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const createLPMutation = useMutation({
    mutationFn: createLp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lps'] });
      onClose();
      setTitle('');
      setContent('');
      setTags([]);
      setThumbnail(null);
      setError(null);
    },
    onError: (error: Error) => {
      console.error('Error creating LP:', error);
      setError('LP 생성 중 오류가 발생했습니다.');
    }
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // 파일 크기 체크 (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('이미지 크기는 5MB를 초과할 수 없습니다.');
        return;
      }
      setThumbnail(file);
      setError(null);
    }
  };

  const handleFileButtonClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fileInputRef.current?.click();
  };

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
    if (thumbnail) {
      formData.append('thumbnail', thumbnail);
    }

    try {
      await createLPMutation.mutateAsync(formData);
    } catch {
      // Error will be handled by onError callback
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <VinylImage src="/vinyl-record.png" alt="Vinyl record" />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="LP Name"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <TextArea
            placeholder="LP Content"
            value={content}
            onChange={e => setContent(e.target.value)}
            required
          />
          <TagSection>
            <TagInput
              type="text"
              placeholder="LP Tag"
              value={newTag}
              onChange={e => setNewTag(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
            />
            <AddButton type="button" onClick={handleAddTag}>Add</AddButton>
          </TagSection>
          {tags.length > 0 && (
            <TagList>
              {tags.map(tag => (
                <TagItem key={tag}>
                  {tag}
                  <RemoveTagButton onClick={() => handleRemoveTag(tag)}>×</RemoveTagButton>
                </TagItem>
              ))}
            </TagList>
          )}
          <div>
            <HiddenFileInput
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <FileButton type="button" onClick={handleFileButtonClick}>
              {thumbnail ? '이미지 변경하기' : '이미지 선택하기'}
            </FileButton>
            {thumbnail && <FileName>{thumbnail.name}</FileName>}
          </div>
          <SubmitButton type="submit" disabled={createLPMutation.isPending}>
            {createLPMutation.isPending ? 'Creating...' : 'Add LP'}
          </SubmitButton>
        </Form>
      </ModalContent>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const ModalContent = styled.div`
  background: #2A2A2A;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  position: relative;
  color: white;
  margin: 2rem;
`;

const VinylImage = styled.img`
  width: 120px;
  height: 120px;
  display: block;
  margin: 0 auto 2rem;
`;

const CloseButton = styled.button`
  position: absolute;
  right: 15px;
  top: 15px;
  background: none;
  border: none;
  font-size: 24px;
  color: white;
  cursor: pointer;
  &:hover {
    color: #ccc;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #333;
  color: white;
  font-size: 1rem;
  &::placeholder {
    color: #888;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

const FileButton = styled.button`
  padding: 12px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  width: 100%;
  &:hover {
    background-color: #555;
  }
`;

const FileName = styled.div`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #888;
`;

const TextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #444;
  border-radius: 6px;
  background-color: #333;
  color: white;
  font-size: 1rem;
  min-height: 100px;
  resize: vertical;
  &::placeholder {
    color: #888;
  }
`;

const TagSection = styled.div`
  display: flex;
  gap: 8px;
`;

const TagInput = styled(Input)`
  flex: 1;
`;

const AddButton = styled.button`
  padding: 0 20px;
  background-color: #444;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

const TagList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
`;

const TagItem = styled.div`
  background-color: #444;
  color: white;
  padding: 4px 8px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const RemoveTagButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  font-size: 16px;
  cursor: pointer;
  padding: 0 4px;
  &:hover {
    color: white;
  }
`;

const SubmitButton = styled.button`
  padding: 12px;
  background-color: #E91E63;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  &:hover:not(:disabled) {
    background-color: #D81B60;
  }
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  margin-bottom: 1rem;
  text-align: center;
  font-size: 0.9rem;
`;

export default LPModal; 