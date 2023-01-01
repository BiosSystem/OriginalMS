package tools.data.output;

import org.apache.mina.core.buffer.IoBuffer;

public class ByteBufferLittleEndianWriter extends GenericLittleEndianWriter {

    private IoBuffer bb;

    /**
     * Constructor - Constructs this object as fixed at the default size.
     */
    public ByteBufferLittleEndianWriter() {
        this(50, true);
    }

    /**
     * Constructor - Constructs this object as fixed at size <code>size</code>.
     *
     * @param size The size of the fixed bytebuffer.
     */
    public ByteBufferLittleEndianWriter(int size) {
        this(size, false);
    }

    /**
     * Constructor - Constructs this object as optionally fixed at size
     * <code>size</code>.
     *
     * @param initialSize The size of the fixed bytebuffer.
     * @param autoExpand Expand if needed.
     */
    public ByteBufferLittleEndianWriter(int initialSize, boolean autoExpand) {
        bb = IoBuffer.allocate(initialSize);
        bb.setAutoExpand(autoExpand);
        super.setByteOutputStream(new ByteBufferOutputstream(bb));
    }

    /**
     * Returns a flipped version of the underlying bytebuffer.
     *
     * @return A flipped version of the underlying bytebuffer.
     */
    public IoBuffer getFlippedBB() {
        return bb.flip();
    }

    /**
     * Returns the underlying bytebuffer.
     *
     * @return The underlying bytebuffer.
     */
    public IoBuffer getByteBuffer() {
        return bb;
    }
}
